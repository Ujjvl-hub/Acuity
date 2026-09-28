
from typing import List
from pydantic import BaseModel, Field


class InterviewQuestions(BaseModel):
    questions: List[str] = Field(
        min_length=10,
        max_length=10,
        description=(
            "Exactly 10 unique, relevant interview questions "
            "for the selected role, interview type, and difficulty."
        ),
    )