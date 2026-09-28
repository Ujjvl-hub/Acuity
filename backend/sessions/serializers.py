
from rest_framework import serializers
from .models import InterviewSession, InterviewAnswer

class InterviewSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewSession
        fields = [
            "id",
            "role",
            "difficulty",
            "interview_type",
            "questions",
            "score",
            "status",
            "duration",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "questions",
            "score",
            "status",
            "duration",
            "created_at",
            "updated_at",
        ]


class InterviewAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewAnswer
        fields = [
            "id",
            "session",
            "question_number",
            "question",
            "answer",
            "technical_score",
            "communication_score",
            "problem_solving_score",
            "score",
            "strengths",
            "improvements",
            "summary",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "session",
            "technical_score",
            "communication_score",
            "problem_solving_score",
            "score",
            "strengths",
            "improvements",
            "summary",
            "created_at",
            "duration"
        ]