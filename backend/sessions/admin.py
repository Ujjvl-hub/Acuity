
from django.contrib import admin
from .models import QuestionBankItem, InterviewSession, InterviewAnswer


@admin.register(QuestionBankItem)
class QuestionBankItemAdmin(admin.ModelAdmin):
    list_display = (
        "question",
        "category",
        "difficulty",
        "topic",
        "is_active",
        "created_at",
    )
    list_filter = ("category", "difficulty", "is_active")
    search_fields = ("question", "topic")
    list_editable = ("is_active",)
    ordering = ("category", "difficulty", "-created_at")


admin.site.register(InterviewSession)
admin.site.register(InterviewAnswer)