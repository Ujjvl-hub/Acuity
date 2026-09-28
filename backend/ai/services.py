
import json
import logging
import os
import re

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from .prompts import EVALUATION_PROMPT
from .schemas import AnswerEvaluation

load_dotenv()
logger = logging.getLogger(__name__)


class AIServiceError(Exception):
    """Raised when the AI evaluation call is misconfigured or fails."""


_llm = None



def _get_llm():
    global _llm

    if _llm is not None:
        return _llm

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise AIServiceError(
            "GROQ_API_KEY is not set. Add it to your .env file."
        )

    _llm = ChatGroq(
        model_name="openai/gpt-oss-20b",
        temperature=0,
        max_tokens=4096,
        reasoning_effort="low",
        api_key=api_key,
    )

    return _llm


def _extract_content(response):
    content = response.content

    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict):
                text = item.get("text")
                if isinstance(text, str):
                    parts.append(text)
        return "".join(parts).strip()

    return ""


def _parse_evaluation(content):
    if not content:
        raise ValueError("The AI returned an empty response.")

    # Remove optional Markdown JSON code fences.
    content = re.sub(
        r"^\s*```(?:json)?\s*|\s*```\s*$",
        "",
        content.strip(),
        flags=re.IGNORECASE,
    )

    data = json.loads(content)
    return AnswerEvaluation.model_validate(data)


def evaluate_answer(
    question: str,
    answer: str,
    role: str,
    difficulty: str,
) -> AnswerEvaluation:
    prompt = EVALUATION_PROMPT.format(
        question=question,
        answer=answer,
        role=role,
        difficulty=difficulty,
    )

    try:
        llm = _get_llm()

        for attempt in range(2):
            current_prompt = prompt

            if attempt == 1:
                current_prompt += (
                    "\n\nYour previous response was empty or invalid. "
                    "Return a complete, valid JSON object only, "
                    "with all the required evaluation fields. "
                    "Do not use Markdown code fences."
                )

            response = llm.invoke(current_prompt)
            content = _extract_content(response)

            try:
                return _parse_evaluation(content)
            except (ValueError, json.JSONDecodeError) as exc:
                metadata = getattr(response, "response_metadata", {})
                logger.warning(
                    "Invalid AI evaluation response. Attempt=%s, "
                    "role=%s, difficulty=%s, finish_reason=%s, error=%s",
                    attempt + 1,
                    role,
                    difficulty,
                    metadata.get("finish_reason"),
                    str(exc),
                )

                if attempt == 1:
                    raise

        raise ValueError("AI evaluation failed after retry.")

    except AIServiceError:
        raise
    except Exception as exc:
        logger.exception(
            "Answer evaluation failed for role=%s difficulty=%s",
            role,
            difficulty,
        )
        raise AIServiceError(
            "Couldn't evaluate the answer right now. Please try again."
        ) from exc