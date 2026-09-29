
from django.db import IntegrityError, transaction
from django.db.models import Avg, Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import (
    InterviewSession,
    InterviewAnswer,
    QuestionBankItem,
)
from .serializers import (
    InterviewSessionSerializer,
    InterviewAnswerSerializer,
    QuestionBankItemSerializer,
)
from ai.services import evaluate_answer, AIServiceError
from ai.question_services import (
    generate_questions,
    QuestionGenerationError,
)


class InterviewSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = InterviewSessionSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = serializer.validated_data
        question_bank_id = request.data.get("question_id")

        if question_bank_id is not None:
            if isinstance(question_bank_id, bool):
                return Response(
                    {"error": "Invalid question ID."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                question_bank_id = int(question_bank_id)
            except (TypeError, ValueError):
                return Response(
                    {"error": "Invalid question ID."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            selected_question = QuestionBankItem.objects.filter(
                id=question_bank_id,
                is_active=True,
            ).first()

            if selected_question is None:
                return Response(
                    {"error": "Question not found or inactive."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            questions = [selected_question.question]

        else:
            previous_sessions = (
                InterviewSession.objects.filter(
                    user=request.user,
                    role=data["role"],
                    interview_type=data["interview_type"],
                    difficulty=data["difficulty"],
                )
                .order_by("-created_at")[:20]
            )

            previous_questions = [
                question
                for previous_session in previous_sessions
                for question in (previous_session.questions or [])
            ]

            try:
                questions = generate_questions(
                    role=data["role"],
                    interview_type=data["interview_type"],
                    difficulty=data["difficulty"],
                    previous_questions=previous_questions,
                )
            except QuestionGenerationError as exc:
                return Response(
                    {"error": str(exc)},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )

        session = serializer.save(
            user=request.user,
            questions=questions,
        )

        return Response(
            {
                "message": "Interview session created successfully",
                "session": InterviewSessionSerializer(session).data,
            },
            status=status.HTTP_201_CREATED,
        )

    def get(self, request):
        sessions = InterviewSession.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = InterviewSessionSerializer(
            sessions,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class QuestionBankView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        questions = QuestionBankItem.objects.filter(
            is_active=True
        )

        category = request.query_params.get("category")
        difficulty = request.query_params.get("difficulty")
        search = request.query_params.get("search", "").strip()

        if category and category != "All":
            questions = questions.filter(category=category)

        if difficulty and difficulty != "All":
            questions = questions.filter(difficulty=difficulty)

        if search:
            questions = questions.filter(
                Q(question__icontains=search)
                | Q(topic__icontains=search)
            )

        serializer = QuestionBankItemSerializer(
            questions,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class InterviewQuestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        try:
            session = InterviewSession.objects.get(
                id=session_id,
                user=request.user,
            )
        except InterviewSession.DoesNotExist:
            return Response(
                {"error": "Interview session not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {
                "session_id": session.id,
                "role": session.role,
                "interview_type": session.interview_type,
                "difficulty": session.difficulty,
                "questions": session.questions,
                "is_completed": session.status == "Completed",
                "status": (
                    "completed"
                    if session.status == "Completed"
                    else session.status
                ),
            },
            status=status.HTTP_200_OK,
        )


class InterviewAnswerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        try:
            session = InterviewSession.objects.get(
                id=session_id,
                user=request.user,
            )
        except InterviewSession.DoesNotExist:
            return Response(
                {"error": "Interview session not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if session.status == "Completed":
            return Response(
                {"error": "This interview has already been completed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = InterviewAnswerSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        question_number = serializer.validated_data["question_number"]

        if not 1 <= question_number <= len(session.questions):
            return Response(
                {"error": "Invalid question number."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        is_final_question = (
            question_number == len(session.questions)
        )

        duration = request.data.get("duration")

        if is_final_question:
            if (
                isinstance(duration, bool)
                or not isinstance(duration, int)
                or duration < 0
            ):
                return Response(
                    {"error": "A valid interview duration is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        question = serializer.validated_data["question"]
        answer_text = serializer.validated_data["answer"]

        if question != session.questions[question_number - 1]:
            return Response(
                {"error": "Question does not match this session."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            evaluation = evaluate_answer(
                question=question,
                answer=answer_text,
                role=session.role,
                difficulty=session.difficulty,
            )
        except AIServiceError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            with transaction.atomic():
                answer = InterviewAnswer.objects.create(
                    session=session,
                    question_number=question_number,
                    question=question,
                    answer=answer_text,
                    technical_score=evaluation.technical_score,
                    communication_score=evaluation.communication_score,
                    problem_solving_score=evaluation.problem_solving_score,
                    score=evaluation.overall_score,
                    strengths=evaluation.strengths,
                    improvements=evaluation.improvements,
                    summary=evaluation.summary,
                )

                if is_final_question:
                    average_score = (
                        InterviewAnswer.objects.filter(
                            session=session
                        ).aggregate(
                            average=Avg("score")
                        )["average"]
                    )

                    session.score = (
                        round(average_score)
                        if average_score is not None
                        else None
                    )
                    session.duration = duration
                    session.status = "Completed"

                    session.save(
                        update_fields=[
                            "score",
                            "duration",
                            "status",
                            "updated_at",
                        ]
                    )

        except IntegrityError:
            return Response(
                {
                    "error": (
                        f"Question {question_number} has already "
                        "been answered for this session."
                    )
                },
                status=status.HTTP_409_CONFLICT,
            )

        return Response(
            {
                "message": "Answer evaluated successfully",
                "answer": InterviewAnswerSerializer(answer).data,
            },
            status=status.HTTP_201_CREATED,
        )

    def get(self, request, session_id):
        try:
            session = InterviewSession.objects.get(
                id=session_id,
                user=request.user,
            )
        except InterviewSession.DoesNotExist:
            return Response(
                {"error": "Interview session not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        answers = InterviewAnswer.objects.filter(
            session=session
        ).order_by("question_number")

        serializer = InterviewAnswerSerializer(
            answers,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = (
            InterviewSession.objects
            .filter(user=request.user)
            .prefetch_related("answers")
            .order_by("-created_at")
        )

        dashboard_sessions = []

        categories = [
            ("technical_score", "Technical skills"),
            ("communication_score", "Communication"),
            ("problem_solving_score", "Problem solving"),
        ]

        for session in sessions:
            data = InterviewSessionSerializer(session).data

            if session.status == "Completed":
                answers = list(session.answers.all())

                scores = [
                    answer.score
                    for answer in answers
                    if answer.score is not None
                ]

                data["score"] = (
                    round(sum(scores) / len(scores))
                    if scores
                    else None
                )

                category_scores = []

                for key, label in categories:
                    values = [
                        getattr(answer, key)
                        for answer in answers
                        if getattr(answer, key) is not None
                    ]

                    if values:
                        category_scores.append({
                            "label": label,
                            "score": sum(values) / len(values),
                        })

                data["categoryScores"] = category_scores

            else:
                data["score"] = None
                data["categoryScores"] = []

            dashboard_sessions.append(data)

        return Response(
            dashboard_sessions,
            status=status.HTTP_200_OK,
        )


class InterviewSessionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        try:
            session = InterviewSession.objects.get(
                id=session_id,
                user=request.user,
            )
        except InterviewSession.DoesNotExist:
            return Response(
                {"error": "Interview session not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = InterviewSessionSerializer(session)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )