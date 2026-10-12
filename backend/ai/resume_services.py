
import json
import logging
import re

from pypdf import PdfReader
from pydantic import ValidationError

from .prompts import RESUME_ANALYSIS_PROMPT
from .schemas import ResumeAnalysis
from .services import AIServiceError, _extract_content, _get_llm

logger = logging.getLogger(__name__)

# Keep in sync with ResumeManager.jsx.
TARGET_ROLES = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Analyst",
    "DevOps Engineer",
]

MAX_RESUME_SIZE = 5 * 1024 * 1024  # 5 MB
MAX_RESUME_PAGES = 5
MAX_RESUME_CHARS = 12000
MIN_RESUME_CHARS = 200


class ResumeParseError(Exception):
    """Raised when text cannot be read from the uploaded PDF."""


def extract_resume_text(file) -> str:
    """
    Extract text from an uploaded PDF.

    Raises ResumeParseError for invalid, encrypted, oversized,
    excessively long, or unreadable PDFs.
    """

    # Validate file size before parsing.
    if file.size > MAX_RESUME_SIZE:
        raise ResumeParseError(
            "Resume PDF must be 5 MB or smaller."
        )

    if not file.name.lower().endswith(".pdf"):
        raise ResumeParseError(
            "Please upload a PDF resume."
        )

    try:
        file.seek(0)
        reader = PdfReader(file)

        if reader.is_encrypted:
            raise ResumeParseError(
                "This PDF is password protected. "
                "Please upload an unlocked copy."
            )

        if len(reader.pages) > MAX_RESUME_PAGES:
            raise ResumeParseError(
                f"Resume PDF must contain "
                f"{MAX_RESUME_PAGES} pages or fewer."
            )

        text = "\n".join(
            page.extract_text() or ""
            for page in reader.pages
        )

    except ResumeParseError:
        raise
    except Exception as exc:
        logger.warning(
            "Could not extract resume PDF text: %s",
            exc,
        )
        raise ResumeParseError(
            "We couldn't read this PDF. "
            "Please upload a valid resume PDF."
        ) from exc

    # Normalize extracted text.
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = text.strip()

    if len(text) < MIN_RESUME_CHARS:
        raise ResumeParseError(
            "We couldn't find enough readable text in this PDF. "
            "Please upload a text-based resume."
        )

    return text[:MAX_RESUME_CHARS]


def _parse_resume_analysis(content: str) -> ResumeAnalysis:
    """Parse and validate the AI's JSON response."""

    if not content or not content.strip():
        raise ValueError(
            "The AI returned an empty response."
        )

    # Remove optional Markdown JSON code fences.
    content = re.sub(
        r"^\s*```(?:json)?\s*|\s*```\s*$",
        "",
        content.strip(),
        flags=re.IGNORECASE,
    )

    data = json.loads(content)

    return ResumeAnalysis.model_validate(data)


def analyze_resume(
    resume_text: str,
    role: str,
) -> ResumeAnalysis:
    """Analyze resume relevance and quality for a target role."""

    if not isinstance(resume_text, str):
        raise ValueError("Resume text must be a string.")

    resume_text = resume_text.strip()

    if len(resume_text) < MIN_RESUME_CHARS:
        raise ValueError(
            "The resume does not contain enough readable text."
        )

    resume_text = resume_text[:MAX_RESUME_CHARS]

    if not isinstance(role, str) or role not in TARGET_ROLES:
        raise ValueError(
            "Please select a valid target role."
        )

    prompt = RESUME_ANALYSIS_PROMPT.format(
        role=role,
        resume_text=resume_text,
    )

    try:
        llm = _get_llm()

        for attempt in range(2):
            current_prompt = prompt

            if attempt == 1:
                current_prompt += (
                    "\n\nYour previous response was empty or invalid. "
                    "Return a complete, valid JSON object only, "
                    "with all required fields and correct data types. "
                    "Do not use Markdown code fences."
                )

            response = llm.invoke(current_prompt)
            content = _extract_content(response)

            try:
                return _parse_resume_analysis(content)

            except (
                ValueError,
                json.JSONDecodeError,
                ValidationError,
            ) as exc:
                logger.warning(
                    "Invalid resume analysis response. "
                    "Attempt=%s, role=%s, error=%s",
                    attempt + 1,
                    role,
                    str(exc),
                )

                if attempt == 1:
                    raise AIServiceError(
                        "The AI returned an invalid resume analysis. "
                        "Please try again."
                    ) from exc

        raise AIServiceError(
            "Resume analysis failed after retry."
        )

    except AIServiceError:
        raise

    except Exception as exc:
        logger.exception(
            "Resume analysis failed for role=%s",
            role,
        )
        raise AIServiceError(
            "Couldn't analyze the resume right now. "
            "Please try again."
        ) from exc
