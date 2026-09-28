from typing import List

from pydantic import BaseModel, Field


class AnswerEvaluation(BaseModel):
    technical_score: int = Field(
        ge=0,
        le=100,
        description="Score for technical knowledge from 0 to 100.",
    )

    communication_score: int = Field(
        ge=0,
        le=100,
        description="Score for clarity, structure, and communication from 0 to 100.",
    )

    problem_solving_score: int = Field(
        ge=0,
        le=100,
        description="Score for logical thinking and problem solving from 0 to 100.",
    )

    overall_score: int = Field(
        ge=0,
        le=100,
        description="Overall score from 0 to 100 based on the three evaluation dimensions.",
    )

    strengths: List[str] = Field(
        default_factory=list,
        max_length=4,
        description="Specific things the candidate did well. Each item should be short and concrete.",
    )

    improvements: List[str] = Field(
        default_factory=list,
        max_length=4,
        description="Specific and actionable ways the candidate could improve.",
    )

    summary: str = Field(
        default="",
        description="One or two sentence overall takeaway about this answer.",
    )