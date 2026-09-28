from unittest.mock import MagicMock, patch

from django.test import SimpleTestCase

from ai.schemas import AnswerEvaluation
from ai.services import evaluate_answer


class AnswerEvaluationTests(SimpleTestCase):
    def test_answer_evaluation_schema(self):
        result = AnswerEvaluation(
            technical_score=85,
            communication_score=90,
            problem_solving_score=80,
            overall_score=85,
            strengths=["Clear explanation", "Correct concepts"],
            improvements=["Add an example"],
            summary="A good answer with room for improvement.",
        )

        self.assertEqual(result.overall_score, 85)
        self.assertEqual(result.technical_score, 85)
        self.assertEqual(result.communication_score, 90)
        self.assertEqual(result.problem_solving_score, 80)
        self.assertEqual(len(result.strengths), 2)

    @patch("ai.services._get_llm")
    def test_evaluate_answer(self, mock_get_llm):
        expected_data = {
            "technical_score": 85,
            "communication_score": 90,
            "problem_solving_score": 80,
            "overall_score": 85,
            "strengths": ["Correct explanation"],
            "improvements": ["Give an example"],
            "summary": "A good answer.",
        }

        mock_response = MagicMock()
        mock_response.content = __import__("json").dumps(expected_data)
        mock_response.response_metadata = {"finish_reason": "stop"}

        mock_llm = MagicMock()
        mock_llm.invoke.return_value = mock_response
        mock_get_llm.return_value = mock_llm

        result = evaluate_answer(
            question="What is the difference between a stack and a queue?",
            answer="A stack follows LIFO, while a queue follows FIFO.",
            role="Software Engineer",
            difficulty="Medium",
        )

        self.assertIsInstance(result, AnswerEvaluation)
        self.assertEqual(result.overall_score, 85)
        self.assertEqual(result.technical_score, 85)
        self.assertEqual(result.strengths, ["Correct explanation"])
        mock_llm.invoke.assert_called_once()