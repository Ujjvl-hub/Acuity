from django.shortcuts import render


import logging

from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import AIServiceError
from .resume_services import (
    TARGET_ROLES,
    ResumeParseError,
    analyze_resume,
    extract_resume_text,
)

logger = logging.getLogger(__name__)


class ResumeAnalysisView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get("resume")
        role = request.data.get("role")

        if not uploaded_file:
            return Response(
                {"error": "Please upload a resume PDF."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not isinstance(role, str) or role not in TARGET_ROLES:
            return Response(
                {
                    "error": "Please select a valid target role.",
                    "allowed_roles": TARGET_ROLES,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            resume_text = extract_resume_text(uploaded_file)
            analysis = analyze_resume(resume_text, role)

            return Response(
                analysis.model_dump(),
                status=status.HTTP_200_OK,
            )

        except ResumeParseError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except AIServiceError as exc:
            logger.warning("Resume analysis service error: %s", exc)
            return Response(
                {
                    "error": (
                        "Resume analysis is temporarily unavailable. "
                        "Please try again later."
                    )
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        except Exception:
            logger.exception("Unexpected resume analysis endpoint error")
            return Response(
                {"error": "An unexpected error occurred. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

