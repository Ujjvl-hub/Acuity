import json
import logging
import os
import random

from dotenv import load_dotenv
from langchain_groq import ChatGroq

from .question_prompts import QUESTION_GENERATION_PROMPT
from .question_schemas import InterviewQuestions

load_dotenv()
logger = logging.getLogger(__name__)


class QuestionGenerationError(Exception):
    """Raised when AI question generation fails."""


def generate_questions(
    role,
    interview_type,
    difficulty,
    previous_questions=None,
):
    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise QuestionGenerationError(
                "GROQ_API_KEY is missing from the environment."
            )

        previous_questions = previous_questions or []

        # Normalize previous questions and remove duplicates.
        seen = set()
        excluded = []
        for question in previous_questions:
            if isinstance(question, str):
                normalized = question.strip().casefold()
                if normalized and normalized not in seen:
                    seen.add(normalized)
                    excluded.append(question.strip())

        llm = ChatGroq(
            model_name="openai/gpt-oss-20b",
            temperature=0.9,
            max_tokens=4096,
            api_key=api_key,
        )

        for attempt in range(3):
            variation = random.randint(100000, 999999)

            prompt = QUESTION_GENERATION_PROMPT.format(
                role=role,
                interview_type=interview_type,
                difficulty=difficulty,
            )

            prompt += f"""

Additional generation instructions:
- Generate exactly 10 distinct interview questions.
- Vary the concepts, scenarios, and wording.
- Do not simply rephrase the same question.
- Avoid repeating any question in the exclusion list.
- Use the variation number {variation} to encourage a different
  selection of topics and scenarios.
- Keep all questions appropriate for the specified role,
  interview type, and difficulty.
- Return a JSON object with a "questions" array only.

Previously asked questions to avoid:
{json.dumps(excluded[-50:], ensure_ascii=False)}
"""

            response = llm.invoke(
                prompt,
                response_format={"type": "json_object"},
            )

            content = response.content
            if isinstance(content, list):
                content = "".join(
                    item.get("text", "")
                    for item in content
                    if isinstance(item, dict)
                )

            if not isinstance(content, str) or not content.strip():
                raise ValueError("AI returned an empty response.")

            data = json.loads(content)
            result = InterviewQuestions.model_validate(data)

            questions = [
                q.strip()
                for q in result.questions
                if isinstance(q, str) and q.strip()
            ]

            normalized_questions = [
                q.casefold() for q in questions
            ]

            if len(questions) != 10:
                raise ValueError(
                    "AI must generate exactly 10 non-empty questions."
                )

            if len(set(normalized_questions)) != 10:
                raise ValueError(
                    "AI generated duplicate questions."
                )

            # Retry if any question exactly matches a previous one.
            repeated = set(normalized_questions) & seen
            if repeated:
                logger.warning(
                    "Repeated questions generated. Attempt=%s",
                    attempt + 1,
                )
                continue

            return questions

        raise ValueError(
            "Unable to generate 10 sufficiently new questions."
        )

    except QuestionGenerationError:
        raise
    except Exception as exc:
        logger.exception("AI question generation failed")
        raise QuestionGenerationError(
            "Unable to generate interview questions."
        ) from exc