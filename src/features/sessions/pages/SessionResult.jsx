import { Link } from "react-router-dom";
import {
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  Clock,
} from "lucide-react";

const performance = [
  { label: "Technical knowledge", score: 82 },
  { label: "Communication", score: 76 },
  { label: "Problem solving", score: 80 },
];

const strengths = [
  "Clear understanding of core technical concepts.",
  "Good problem-solving approach.",
  "Able to explain concepts with relevant examples.",
];

const improvements = [
  "Structure longer answers more clearly.",
  "Explain trade-offs before giving a final decision.",
  "Use more real-world examples when discussing concepts.",
];

const questions = [
  { number: "01", question: "Process vs Thread", score: 84 },
  { number: "02", question: "How the web works", score: 78 },
  { number: "03", question: "REST vs GraphQL", score: 82 },
  { number: "04", question: "Database indexing", score: 74 },
  { number: "05", question: "Authentication vs Authorization", score: 80 },
];

function getScoreColor(score) {
  if (score >= 80) return "text-focus";
  if (score >= 70) return "text-brass";
  return "text-red-500";
}

function getScoreBarColor(score) {
  if (score >= 80) return "bg-focus";
  if (score >= 70) return "bg-brass";
  return "bg-red-500";
}

export default function SessionResult() {
  const overallScore = 78;

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
            Acuity evaluated your answers across technical knowledge,
            communication, and problem-solving.
          </p>

          {/* Session summary */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-[3px] border border-hairline px-2.5 py-1 text-xs text-slate">
              Software Engineer
            </span>

            <span className="rounded-[3px] border border-hairline px-2.5 py-1 text-xs text-slate">
              Technical
            </span>

            <span className="rounded-[3px] border border-hairline px-2.5 py-1 text-xs text-slate">
              Intermediate
            </span>

            <span className="flex items-center gap-1 rounded-[3px] border border-hairline px-2.5 py-1 text-xs text-slate">
              <Clock size={12} />
              18 min
            </span>
          </div>
        </div>
      </section>

      {/* Overall score */}
      <section className="grid border-b border-hairline py-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* Score */}
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
              {overallScore}
            </span>

            <span className="mb-2 font-mono text-xl text-slate">
              /100
            </span>
          </div>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate">
            A solid performance. Your technical foundation is strong,
            with the biggest opportunity for improvement in communication
            and answer structure.
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
                    {item.score}%
                  </span>
                </div>

                <div className="mt-2 h-[3px] w-full bg-hairline">
                  <div
                    className={`h-full ${getScoreBarColor(item.score)}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Insight */}
      <section className="border-b border-hairline py-10">
        <div className="rounded-[4px] border border-focus/20 bg-focus/5 p-6">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-focus" />

            <p className="text-sm font-semibold text-ink">
              Acuity insight
            </p>
          </div>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate">
            Your technical understanding is strong, and you generally
            arrive at the correct solution. The biggest opportunity is
            explaining your reasoning more clearly before jumping to the
            final answer. Try structuring responses as:
            problem → approach → trade-offs → conclusion.
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
            {strengths.map((item) => (
              <div key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-focus" />

                <p className="text-sm leading-relaxed text-slate">
                  {item}
                </p>
              </div>
            ))}
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
            {improvements.map((item) => (
              <div key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />

                <p className="text-sm leading-relaxed text-slate">
                  {item}
                </p>
              </div>
            ))}
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
          {questions.map((item) => (
            <div
              key={item.number}
              className="flex items-center justify-between gap-5 border-b border-hairline py-5"
            >
              <div className="flex items-center gap-5">
                <span className="font-mono text-sm text-brass">
                  {item.number}
                </span>

                <span className="text-sm font-medium text-ink">
                  {item.question}
                </span>
              </div>

              <span
                className={`font-mono text-xl font-medium ${getScoreColor(
                  item.score
                )}`}
              >
                {item.score}%
              </span>
            </div>
          ))}
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
              Practice system design and answer structure.
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate">
              Focus on explaining your reasoning step by step and clearly
              communicating technical trade-offs.
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
    </div>
  );
}