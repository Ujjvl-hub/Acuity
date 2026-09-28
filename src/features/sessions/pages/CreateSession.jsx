import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import useAuth from "../../../hooks/useAuth.js";
import { createSession } from "../../../api/session.api.js";

const roles = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "DevOps Engineer",
];

const interviewTypes = [
  {
    name: "Technical",
    description: "Test your technical knowledge and problem-solving.",
  },
  {
    name: "Behavioral",
    description: "Focus on communication and past experiences.",
  },
  {
    name: "HR",
    description: "Practice common HR and culture-fit questions.",
  },
  {
    name: "Mixed",
    description: "A balanced interview across multiple areas.",
  },
];

const difficulties = [
  {
    name: "Beginner",
    description: "Build confidence with foundational questions.",
  },
  {
    name: "Intermediate",
    description: "Questions closer to typical interview rounds.",
  },
  {
    name: "Advanced",
    description: "More challenging questions and deeper evaluation.",
  },
];

const difficultyMap = {
  Beginner: "Easy",
  Intermediate: "Medium",
  Advanced: "Hard",
};

export default function CreateSession() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [role, setRole] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isReady = role && interviewType && difficulty;

  const handleStart = async () => {
    if (!isReady || !user?.id) {
      setError("Please log in before starting an interview.");
      return;
    }

    setLoading(true);
    setError("");

    const sessionConfig = {
      role,
      difficulty: difficultyMap[difficulty],
      interview_type: interviewType,
    };

    try {
      const response = await createSession(sessionConfig);

      const createdSession = response.data.session;

      console.log(
        "Interview session created:",
        createdSession
      );

      navigate(`/sessions/${createdSession.id}`, {
        state: {
          sessionConfig: {
            role,
            interviewType,
            difficulty,
          },
        },
      });
    } catch (err) {
      console.error(
        "Session creation failed:",
        err
      );

      if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please log in again."
        );
      } else {
        setError(
          err.response?.data?.error ||
            "Unable to create interview session. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <section className="border-b border-hairline pb-8">
        <p className="text-sm text-slate">
          Interview practice
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Configure your interview.
        </h1>

        <p className="mt-3 max-w-xl leading-relaxed text-slate">
          Choose what you want to practice. Acuity will
          adapt the interview based on your selections
          and performance.
        </p>
      </section>

      {/* Configuration */}
      <div className="space-y-10 py-10">
        {/* Target Role */}
        <section>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-sm text-brass">
              01
            </span>

            <h2 className="text-xl font-semibold text-ink">
              Target role
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate">
            Select the role you want to prepare for.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {roles.map((item) => {
              const selected = role === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRole(item)}
                  className={`flex items-center justify-between rounded-[4px] border px-4 py-4 text-left text-sm transition-colors ${
                    selected
                      ? "border-focus bg-focus/5 text-ink"
                      : "border-hairline bg-paper text-slate hover:border-ink/30"
                  }`}
                >
                  <span className="font-medium">
                    {item}
                  </span>

                  {selected && (
                    <Check
                      size={17}
                      className="text-focus"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Interview Type */}
        <section className="border-t border-hairline pt-10">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-sm text-brass">
              02
            </span>

            <h2 className="text-xl font-semibold text-ink">
              Interview type
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate">
            Choose the kind of interview you want to
            simulate.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {interviewTypes.map((item) => {
              const selected =
                interviewType === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    setInterviewType(item.name)
                  }
                  className={`relative rounded-[4px] border p-5 text-left transition-colors ${
                    selected
                      ? "border-focus bg-focus/5"
                      : "border-hairline hover:border-ink/30"
                  }`}
                >
                  {selected && (
                    <Check
                      size={17}
                      className="absolute right-4 top-4 text-focus"
                    />
                  )}

                  <h3 className="text-sm font-semibold text-ink">
                    {item.name}
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Difficulty */}
        <section className="border-t border-hairline pt-10">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-sm text-brass">
              03
            </span>

            <h2 className="text-xl font-semibold text-ink">
              Difficulty
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate">
            Acuity will use this as the starting point
            and adapt as you progress.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {difficulties.map((item) => {
              const selected =
                difficulty === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    setDifficulty(item.name)
                  }
                  className={`relative rounded-[4px] border p-5 text-left transition-colors ${
                    selected
                      ? "border-focus bg-focus/5"
                      : "border-hairline hover:border-ink/30"
                  }`}
                >
                  {selected && (
                    <Check
                      size={17}
                      className="absolute right-4 top-4 text-focus"
                    />
                  )}

                  <h3 className="text-sm font-semibold text-ink">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Selected Configuration */}
      {isReady && (
        <section className="border-t border-hairline py-6">
          <p className="text-sm text-slate">
            Your interview configuration
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-[3px] border border-hairline px-3 py-1.5 text-sm text-ink">
              {role}
            </span>

            <span className="rounded-[3px] border border-hairline px-3 py-1.5 text-sm text-ink">
              {interviewType}
            </span>

            <span className="rounded-[3px] border border-hairline px-3 py-1.5 text-sm text-ink">
              {difficulty}
            </span>
          </div>
        </section>
      )}

      {/* Error Message */}
      {error && (
        <p className="mb-4 rounded-[4px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Start Section */}
      <section className="flex flex-col gap-5 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-ink">
            Ready when you are.
          </p>

          <p className="mt-1 text-sm text-slate">
            Select all three options to begin your
            interview.
          </p>
        </div>

        <button
          type="button"
          disabled={!isReady || loading}
          onClick={handleStart}
          className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-focus px-5 py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading
            ? "Creating session..."
            : "Start interview"}

          {!loading && <ArrowRight size={16} />}
        </button>
      </section>
    </div>
  );
}