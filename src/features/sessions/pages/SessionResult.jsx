
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  Clock,
} from "lucide-react";

import {
  getSessionAnswers,
  getSession,
} from "../../../api/session.api.js";

function getScoreColor(score) {
  if (typeof score !== "number") return "text-slate";
  if (score >= 80) return "text-focus";
  if (score >= 70) return "text-brass";
  return "text-red-500";
}

function getScoreBarColor(score) {
  if (score >= 80) return "bg-focus";
  if (score >= 70) return "bg-brass";
  return "bg-red-500";
}

function formatDuration(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds} sec`;
  }

  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${remainingSeconds} sec`;
}

function getInsight(score) {
  if (score === null) {
    return "Your overall score is not available yet. Complete and submit your interview answers to receive your performance summary.";
  }

  if (score >= 80) {
    return "Your answers demonstrate a strong overall understanding. Focus on maintaining technical accuracy while making your explanations even more structured and concise.";
  }

  if (score >= 70) {
    return "You have a solid foundation across the interview. Focus on filling technical gaps and making your reasoning more structured and specific.";
  }

  if (score >= 60) {
    return "You demonstrate a developing understanding of the topics. Focus on strengthening core concepts and explaining your reasoning step by step.";
  }

  return "This interview highlights several areas to work on. Focus on strengthening the fundamentals and practicing structured explanations.";
}

function getAverageScore(answers, key) {
  const scores = answers
    .map((item) => item[key])
    .filter(
      (score) =>
        typeof score === "number" &&
        Number.isFinite(score)
    );

  if (scores.length === 0) return null;

  return Math.round(
    scores.reduce((sum, score) => sum + score, 0) /
      scores.length
  );
}

export default function SessionResult() {
  const { id } = useParams();

  const [answers, setAnswers] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchResults = async () => {
      setLoading(true);
      setError("");

      try {
        const [answersResponse, sessionResponse] =
          await Promise.all([
            getSessionAnswers(id),
            getSession(id),
          ]);

        if (cancelled) return;

        setAnswers(
          Array.isArray(answersResponse.data)
            ? answersResponse.data
            : answersResponse.data?.results || []
        );

        setSession(sessionResponse.data);
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Error fetching interview results:",
          err.response?.data || err.message
        );

        if (err.response?.status === 401) {
          setError(
            "Your session has expired. Please sign in again."
          );
        } else if (err.response?.status === 404) {
          setError("Interview session not found.");
        } else {
          setError("Unable to load interview results.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchResults();
    } else {
      setError("Invalid interview session.");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  const sessionConfig = {
    role: session?.role || "Interview",
    interviewType:
      session?.interview_type || "Technical",
    difficulty: session?.difficulty || "Not specified",
  };

  const duration = Number(session?.duration) || 0;

  const scoredAnswers = answers.filter(
    (item) =>
      typeof item.score === "number" &&
      Number.isFinite(item.score)
  );

  const overallScore = getAverageScore(answers, "score");

  const performance = [
    {
      label: "Technical knowledge",
      key: "technical_score",
    },
    {
      label: "Communication",
      key: "communication_score",
    },
    {
      label: "Problem solving",
      key: "problem_solving_score",
    },
  ].map(({ label, key }) => ({
    label,
    score: getAverageScore(answers, key),
  }));

  const uniqueStrengths = [...new Set(
    answers.flatMap((item) => Array.isArray(item.strengths) ? item.strengths : []).filter((item) =>
        typeof item === "string" &&
        item.trim() &&
        item.trim().toLowerCase() !== "none demonstrated in this answer."
      )
      .map((item) => item.trim())
    ),
  ];

  const uniqueImprovements = [...new Set(answers.flatMap((item) => Array.isArray(item.improvements) ? item.improvements : [])
      .filter((item) => typeof item === "string" && item.trim())
      .map((item) => item.trim())
    ),
  ];

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <section className="border-b border-hairline pb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="mt-8">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Here's how you performed.
          </h1>

          <p className="mt-3 max-w-xl leading-relaxed text-slate">
            Acuity evaluated your answers across technical
            knowledge, communication, and problem-solving.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-[3px] border border-hairline px-2.5 py-1 text-xs text-slate">
              {sessionConfig.role}
            </span>

            <span className="rounded-[3px] border border-hairline px-2.5 py-1 text-xs text-slate">
              {sessionConfig.interviewType}
            </span>

            <span className="rounded-[3px] border border-hairline px-2.5 py-1 text-xs text-slate">
              {sessionConfig.difficulty}
            </span>

            <span className="flex items-center gap-1 rounded-[3px] border border-hairline px-2.5 py-1 text-xs text-slate">
              <Clock size={12} />
              {formatDuration(duration)}
            </span>
          </div>
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="py-16 text-center">
          <p className="text-sm text-slate">
            Loading your interview results...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="py-16 text-center">
          <p className="text-sm text-red-500">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-[4px] border border-hairline px-4 py-2 text-sm font-medium text-ink hover:border-ink"
          >
            Try again
          </button>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          {/* Overall score and performance */}
          <section className="grid border-b border-hairline py-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="text-sm text-slate">
                Overall performance
              </p>

              <div className="mt-5 flex items-end gap-2">
                <span
                  className={`font-mono text-7xl font-medium ${getScoreColor(
                    overallScore
                  )}`}
                >
                  {overallScore === null
                    ? "N/A"
                    : overallScore}
                </span>

                <span className="mb-2 font-mono text-xl text-slate">
                  /100
                </span>
              </div>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate">
                {getInsight(overallScore)}
              </p>
            </div>

            {/* Performance breakdown */}
            <div className="mt-10 lg:mt-0">
              <p className="text-sm font-medium text-ink">
                Performance breakdown
              </p>

              <div className="mt-6 space-y-6">
                {performance.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate">
                        {item.label}
                      </span>

                      <span
                        className={`font-mono text-lg font-medium ${getScoreColor(
                          item.score
                        )}`}
                      >
                        {item.score === null
                          ? "N/A"
                          : `${item.score}%`}
                      </span>
                    </div>

                    {item.score !== null && (
                      <div className="mt-2 h-[3px] w-full bg-hairline">
                        <div
                          className={`h-full ${getScoreBarColor(
                            item.score
                          )}`}
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, item.score)
                            )}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* AI Insight */}
          <section className="border-b border-hairline py-10">
            <div className="rounded-[4px] border border-focus/20 bg-focus/5 p-6">
              <div className="flex items-center gap-2">
                <Sparkles
                  size={18}
                  className="text-focus"
                />

                <p className="text-sm font-semibold text-ink">
                  Acuity insight
                </p>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate">
                {getInsight(overallScore)}
              </p>
            </div>
          </section>

          {/* Feedback */}
          <section className="grid gap-10 border-b border-hairline py-10 lg:grid-cols-2">
            {/* Strengths */}
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={18}
                  className="text-focus"
                />

                <h2 className="text-xl font-semibold text-ink">
                  What you did well
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {uniqueStrengths.length > 0 ? (
                  uniqueStrengths.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex gap-3"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-focus" />

                      <p className="text-sm leading-relaxed text-slate">
                        {item}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate">
                    No strengths available yet.
                  </p>
                )}
              </div>
            </div>

            {/* Improvements */}
            <div>
              <div className="flex items-center gap-2">
                <AlertCircle
                  size={18}
                  className="text-brass"
                />

                <h2 className="text-xl font-semibold text-ink">
                  Areas to improve
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {uniqueImprovements.length > 0 ? (
                  uniqueImprovements.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex gap-3"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />

                      <p className="text-sm leading-relaxed text-slate">
                        {item}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate">
                    No improvement feedback available yet.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Question performance */}
          <section className="border-b border-hairline py-10">
            <div className="flex items-center gap-2">
              <TrendingUp
                size={18}
                className="text-focus"
              />

              <div>
                <p className="text-sm text-slate">
                  Detailed breakdown
                </p>

                <h2 className="mt-1 text-xl font-semibold text-ink">
                  Question performance
                </h2>
              </div>
            </div>

            <div className="mt-8 border-t border-hairline">
              {answers.length === 0 ? (
                <p className="py-6 text-sm text-slate">
                  No answers found for this interview.
                </p>
              ) : (
                answers.map((item, index) => (
                  <div
                    key={item.id ?? index}
                    className="border-b border-hairline py-5"
                  >
                    <div className="flex items-center justify-between gap-5">
                      <div className="flex min-w-0 items-center gap-5">
                        <span className="font-mono text-sm text-brass">
                          {String(
                            item.question_number ?? index + 1
                          ).padStart(2, "0")}
                        </span>

                        <span className="text-sm font-medium text-ink">
                          {item.question}
                        </span>
                      </div>

                      <span
                        className={`shrink-0 font-mono text-xl font-medium ${getScoreColor(
                          typeof item.score === "number"
                            ? item.score
                            : null
                        )}`}
                      >
                        {typeof item.score === "number"
                          ? `${item.score}%`
                          : "N/A"}
                      </span>
                    </div>

                    {/* Submitted answer */}
                    <div className="ml-10 mt-3 rounded-[4px] bg-paper p-3">
                      <p className="text-xs font-medium text-slate">
                        Your answer
                      </p>

                      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate">
                        {item.answer || "No answer submitted."}
                      </p>
                    </div>

                    {/* AI summary */}
                    {item.summary && (
                      <div className="ml-10 mt-3">
                        <p className="text-xs font-medium text-focus">
                          AI feedback
                        </p>

                        <p className="mt-1 text-sm leading-relaxed text-slate">
                          {item.summary}
                        </p>
                      </div>
                    )}

                    {/* Strengths */}
                    {Array.isArray(item.strengths) &&
                      item.strengths.length > 0 && (
                        <div className="ml-10 mt-3">
                          <p className="text-xs font-medium text-ink">
                            Strengths
                          </p>

                          <ul className="mt-1 list-disc pl-5 text-sm leading-relaxed text-slate">
                            {item.strengths.map(
                              (strength, strengthIndex) => (
                                <li key={strengthIndex}>
                                  {strength}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Improvements */}
                    {Array.isArray(item.improvements) &&
                      item.improvements.length > 0 && (
                        <div className="ml-10 mt-3">
                          <p className="text-xs font-medium text-brass">
                            Improvements
                          </p>

                          <ul className="mt-1 list-disc pl-5 text-sm leading-relaxed text-slate">
                            {item.improvements.map(
                              (improvement, improvementIndex) => (
                                <li key={improvementIndex}>
                                  {improvement}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Recommendation */}
          <section className="py-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate">
                  Recommended next step
                </p>

                <h2 className="mt-1 text-xl font-semibold text-ink">
                  Review your feedback and practice again.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate">
                  Use the AI feedback from each question to
                  improve your explanations and problem-solving
                  approach.
                </p>
              </div>

              <div className="flex shrink-0 gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-[4px] border border-hairline px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
                >
                  Dashboard
                </Link>

                <Link
                  to="/sessions/create"
                  className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-focus px-4 py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
                >
                  <RotateCcw size={16} />
                  Practice again
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}