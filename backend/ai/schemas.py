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


class ResumeAnalysis(BaseModel):
    ats_score: int = Field(
        ge=0,
        le=100,
        description="Resume relevance score for the selected target role, from 0 to 100.",
    )

    summary: str = Field(
        min_length=1,
        description="A concise overall assessment of the resume.",
    )

    strengths: List[str] = Field(
        min_length=1,
        max_length=6,
        description="Specific strengths supported by the resume.",
    )

    improvements: List[str] = Field(
        min_length=1,
        max_length=6,
        description="Concrete, actionable improvements for the resume.",
    )

    missing_skills: List[str] = Field(
        default_factory=list,
        max_length=10,
        description="Relevant skills not demonstrated by the resume.",
    )

    role_match: str = Field(
        min_length=1,
        description="Explanation of how the resume aligns with the selected target role.",
    )
