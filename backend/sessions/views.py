
from django.db import IntegrityError, transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import InterviewSession, InterviewAnswer
from .serializers import (
    InterviewSessionSerializer,
    InterviewAnswerSerializer,
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

        # Collect questions from the user's recent matching interviews.
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
                    session.duration = duration
                    session.status = "Completed"
                    session.save(
                        update_fields=[
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