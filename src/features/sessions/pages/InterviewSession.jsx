
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getSessionQuestions,
  submitAnswer,
} from "../../../api/session.api";
import {
  Clock,
  Mic,
  Send,
  ChevronLeft,
  MoreHorizontal,
} from "lucide-react";

export default function InterviewSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [answer, setAnswer] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  const [sessionConfig, setSessionConfig] = useState(
    location.state?.sessionConfig || {
      role: "Software Engineer",
      interviewType: "Technical",
      difficulty: "Easy",
    }
  );

  // Load interview questions and session status.
  useEffect(() => {
    let cancelled = false;

    const loadQuestions = async () => {
      setLoadingQuestions(true);
      setErrorMessage("");

      try {
        const response = await getSessionQuestions(id);
        const data = response.data;

        if (cancelled) return;

        // Handle completed sessions returned by the backend.
        if (
          data.is_completed === true ||
          data.status === "completed"
        ) {
          setInterviewCompleted(true);
        }

        if (
          !Array.isArray(data.questions) ||
          data.questions.length === 0
        ) {
          throw new Error("No questions were found for this interview.");
        }

        setQuestions(
          data.questions.map((text, index) => ({
            id: index + 1,
            text,
          }))
        );

        setSessionConfig({
          role: data.role,
          interviewType: data.interview_type,
          difficulty: data.difficulty,
        });
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Error loading questions:",
          error.response?.data || error.message
        );

        setErrorMessage(
          error.response?.data?.error ||
            error.response?.data?.detail ||
            error.message ||
            "Unable to load interview questions. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoadingQuestions(false);
        }
      }
    };

    if (id) {
      loadQuestions();
    } else {
      setLoadingQuestions(false);
      setErrorMessage("Invalid interview session.");
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Interview timer.
  useEffect(() => {
    if (
      loadingQuestions ||
      errorMessage ||
      interviewCompleted ||
      questions.length === 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [
    loadingQuestions,
    errorMessage,
    interviewCompleted,
    questions.length,
  ]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");

    const seconds = (totalSeconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  const totalQuestions = questions.length;
  const questionNumber = questionIndex + 1;
  const question = questions[questionIndex];
  const isLastQuestion = questionIndex === totalQuestions - 1;

  const progress =
    totalQuestions > 0
      ? (questionNumber / totalQuestions) * 100
      : 0;

  // Submit the current answer.
  const handleSubmit = async () => {
    if (
      !answer.trim() ||
      submitting ||
      interviewCompleted ||
      !question
    ) {
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    const currentAnswer = {
      question_number: question.id,
      question: question.text,
      answer: answer.trim(),
      ...(isLastQuestion ? { duration: elapsedSeconds } : {}),
    };

    try {
      const response = await submitAnswer(id, currentAnswer);
      const savedAnswer = response.data.answer;

      const updatedAnswers = [
        ...answers,
        {
          questionNumber: savedAnswer.question_number,
          question: savedAnswer.question,
          answer: savedAnswer.answer,
          technicalScore: savedAnswer.technical_score,
          communicationScore: savedAnswer.communication_score,
          problemSolvingScore: savedAnswer.problem_solving_score,
          score: savedAnswer.score,
          strengths: savedAnswer.strengths ?? [],
          improvements: savedAnswer.improvements ?? [],
          summary: savedAnswer.summary ?? "",
        },
      ];

      setAnswers(updatedAnswers);
      setAnswer("");

      if (!isLastQuestion) {
        setQuestionIndex((previous) => previous + 1);
      } else {
        navigate(`/sessions/${id}/result`, {
          replace: true,
          state: {
            sessionConfig,
            answers: updatedAnswers,
            duration: elapsedSeconds,
          },
        });
      }
    } catch (error) {
      console.error(
        "Error submitting answer:",
        error.response?.data || error.message
      );

      const status = error.response?.status;
      const serverMessage =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "";

      if (
        status === 400 &&
        /already completed|interview is completed|session is completed/i.test(
          serverMessage
        )
      ) {
        setInterviewCompleted(true);
        setErrorMessage(
          "This interview has already been completed."
        );
      } else if (status === 409) {
        setErrorMessage(
          "This question has already been answered. Please refresh the interview."
        );
      } else if (status === 503) {
        setErrorMessage(
          serverMessage ||
            "AI evaluation is temporarily unavailable. Please try again."
        );
      } else if (status === 401) {
        setErrorMessage(
          "Your session has expired. Please sign in again."
        );
      } else if (error.code === "ECONNABORTED") {
        setErrorMessage(
          "The evaluation is taking too long. Please check your connection before retrying."
        );
      } else {
        setErrorMessage(
          serverMessage ||
            "Unable to submit your answer. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeaveInterview = () => {
    const confirmed = window.confirm(
      "Are you sure you want to leave the interview? Your progress may not be saved."
    );

    if (confirmed) {
      navigate("/sessions/create");
    }
  };

  // Loading state.
  if (loadingQuestions) {
    return (
      <div className="mx-auto max-w-5xl py-24 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-hairline border-t-focus" />
        <p className="mt-4 text-sm text-slate">
          Acuity is loading your interview questions...
        </p>
      </div>
    );
  }

  // Error while loading questions.
  if (errorMessage && questions.length === 0 && !interviewCompleted) {
    return (
      <div className="mx-auto max-w-5xl py-16">
        <div className="rounded-[4px] border border-red-300 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-700">
            Unable to load interview
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={() => navigate("/sessions/create")}
            className="mt-5 rounded-[4px] bg-focus px-4 py-2 text-sm font-semibold text-paper"
          >
            Back to configuration
          </button>
        </div>
      </div>
    );
  }

  // Completed interview screen.
  if (interviewCompleted) {
    return (
      <div className="mx-auto max-w-5xl py-20">
        <div className="rounded-[4px] border border-hairline bg-paper p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <h2 className="mt-5 text-2xl font-semibold text-ink">
            Interview completed
          </h2>

          <p className="mt-3 text-sm text-slate">
            This interview has already been completed.
            You can return to your dashboard to review your progress.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard", { replace: true })
            }
            className="mt-6 rounded-[4px] bg-focus px-5 py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  // No current question.
  if (!question) {
    return (
      <div className="mx-auto max-w-5xl py-16 text-center">
        <p className="text-sm text-slate">
          No interview question is currently available.
        </p>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mt-5 rounded-[4px] bg-focus px-5 py-2.5 text-sm font-semibold text-paper"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <section className="border-b border-hairline pb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleLeaveInterview}
              disabled={submitting}
              className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-hairline text-slate transition-colors hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              title="Leave interview"
            >
              <ChevronLeft size={18} />
            </button>

            <div>
              <p className="text-sm font-medium text-ink">
                {sessionConfig.role} Interview
              </p>

              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <span className="rounded-[3px] border border-hairline px-1.5 py-0.5 text-xs text-slate">
                  {sessionConfig.interviewType}
                </span>
                <span className="rounded-[3px] border border-hairline px-1.5 py-0.5 text-xs text-slate">
                  {sessionConfig.difficulty}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="text-slate transition-colors hover:text-ink"
            title="More options"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate">Progress</span>
            <span className="font-mono text-ink">
              {questionNumber} / {totalQuestions}
            </span>
          </div>

          <div className="mt-2 h-[3px] w-full overflow-hidden bg-hairline">
            <div
              className="h-full bg-focus transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-brass">
            {String(questionNumber).padStart(2, "0")}
          </span>
          <span className="text-sm text-slate">
            Current question
          </span>
        </div>

        <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          {question.text}
        </h1>

        <div className="my-10 border-t border-hairline" />

        <div>
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="answer"
              className="text-sm font-medium text-ink"
            >
              Your answer
            </label>

            <span className="text-xs text-slate">
              Be clear and structured.
            </span>
          </div>

          <div className="relative mt-3">
            <textarea
              id="answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              disabled={submitting}
              placeholder="Start typing your answer..."
              className="min-h-[220px] w-full resize-none rounded-[4px] border border-hairline bg-paper px-4 py-4 text-sm leading-relaxed text-ink placeholder:text-slate/50 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/10 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-slate">
              <Mic size={14} />
              <span className="hidden sm:inline">
                Voice input coming soon
              </span>
            </div>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="mt-3 text-sm text-red-600"
            >
              {errorMessage}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-5 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Clock size={17} className="text-brass" />
            <div>
              <p className="text-xs text-slate">Time elapsed</p>
              <p className="font-mono text-lg font-medium text-ink">
                {formatTime(elapsedSeconds)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!answer.trim() || submitting || interviewCompleted}
            className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-focus px-5 py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting
              ? "Evaluating..."
              : isLastQuestion
                ? "Finish interview"
                : "Submit answer"}
            {!submitting && <Send size={16} />}
          </button>
        </div>
      </section>

      <section className="border-t border-hairline py-6">
        <div className="flex items-center gap-3">
          <div
            className={`h-2 w-2 rounded-full ${
              submitting
                ? "animate-pulse bg-focus"
                : "bg-hairline"
            }`}
          />
          <p className="text-sm text-slate">
            {submitting
              ? "Acuity is evaluating your answer."
              : isLastQuestion
                ? "This is your final question."
                : "Ready for your answer."}
          </p>
        </div>
      </section>
    </div>
  );
}