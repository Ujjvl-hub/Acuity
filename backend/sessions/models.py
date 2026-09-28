
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class InterviewSession(models.Model):
    DIFFICULTY_CHOICES = [
        ("Easy", "Easy"),
        ("Medium", "Medium"),
        ("Hard", "Hard"),
    ]

    INTERVIEW_TYPE_CHOICES = [
        ("Technical", "Technical"),
        ("Behavioral", "Behavioral"),
        ("HR", "HR"),
        ("Mixed", "Mixed"),
    ]

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Completed", "Completed"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="interview_sessions",
    )

    role = models.CharField(max_length=100)

    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default="Medium",
    )

    interview_type = models.CharField(
        max_length=20,
        choices=INTERVIEW_TYPE_CHOICES,
        default="Technical",
    )

    questions = models.JSONField(
        default=list,
        blank=True,
    )

    score = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    duration = models.PositiveIntegerField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class InterviewAnswer(models.Model):
    session = models.ForeignKey(
        InterviewSession,
        on_delete=models.CASCADE,
        related_name="answers",
    )

    question_number = models.PositiveIntegerField(
        help_text="This answer's position within the session (1, 2, 3, ...).",
    )

    question = models.TextField()
    answer = models.TextField()

    technical_score = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100),
        ],
    )

    communication_score = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100),
        ],
    )

    problem_solving_score = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100),
        ],
    )

    score = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100),
        ],
    )

    strengths = models.JSONField(
        null=True,
        blank=True,
    )

    improvements = models.JSONField(
        null=True,
        blank=True,
    )

    summary = models.TextField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["question_number"]
        constraints = [
            models.UniqueConstraint(
                fields=["session", "question_number"],
                name="unique_question_number_per_session",
            )
        ]

    def __str__(self):
        return f"Session {self.session_id} · Q{self.question_number}"