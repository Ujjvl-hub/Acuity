from django.urls import path
from .views import ( InterviewSessionView,InterviewSessionDetailView, InterviewAnswerView, InterviewQuestionsView,DashboardView,)

urlpatterns = [
    path(
        "",
        InterviewSessionView.as_view(),
        name="interview-sessions",
    ),
    path(
        "dashboard/",
        DashboardView.as_view(),
        name="dashboard",
    ),
    path(
        "<int:session_id>/questions/",
        InterviewQuestionsView.as_view(),
        name="interview-questions",
    ),
    path(
        "<int:session_id>/answers/",
        InterviewAnswerView.as_view(),
        name="submit-answer",
    ),
    path(
        "<int:session_id>/",
        InterviewSessionDetailView.as_view(),
        name="interview-session-detail",
    ),
]