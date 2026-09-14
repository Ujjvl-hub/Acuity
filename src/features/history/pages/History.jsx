import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Clock,
  Calendar,
  FileText,
  ChevronRight,
} from "lucide-react";

const sessions = [
  {
    id: 1,
    role: "Software Engineer",
    type: "Technical",
    difficulty: "Intermediate",
    date: "Sep 12, 2026",
    duration: "18 min",
    score: 82,
  },
  {
    id: 2,
    role: "Frontend Developer",
    type: "Technical",
    difficulty: "Intermediate",
    date: "Sep 10, 2026",
    duration: "16 min",
    score: 76,
  },
  {
    id: 3,
    role: "Backend Developer",
    type: "Mixed",
    difficulty: "Advanced",
    date: "Sep 8, 2026",
    duration: "22 min",
    score: 68,
  },
  {
    id: 4,
    role: "Software Engineer",
    type: "Behavioral",
    difficulty: "Intermediate",
    date: "Sep 5, 2026",
    duration: "14 min",
    score: 84,
  },
  {
    id: 5,
    role: "Full Stack Developer",
    type: "Mixed",
    difficulty: "Intermediate",
    date: "Sep 2, 2026",
    duration: "20 min",
    score: 79,
  },
];

const filters = ["All", "Technical", "Behavioral", "HR", "Mixed"];

function getScoreTextColor(score) {
  if (score >= 80) return "text-focus";
  if (score >= 70) return "text-brass";

  return "text-red-500";
}

function getPerformanceLabel(score) {
  if (score >= 80) return "Strong";
  if (score >= 70) return "Improving";

  return "Needs work";
}

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const searchableContent = [
        session.role,
        session.type,
        session.difficulty,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableContent.includes(
        searchQuery.toLowerCase()
      );

      const matchesFilter =
        activeFilter === "All" || session.type === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  const averageScore = Math.round(
    sessions.reduce((sum, session) => sum + session.score, 0) /
      sessions.length
  );

  const bestScore = Math.max(
    ...sessions.map((session) => session.score)
  );

  return (
    <div className="mx-auto max-w-6xl">

      {/* Header */}
      <section className="border-b border-hairline pb-8">

        <p className="text-sm text-slate">
          Interview progress
        </p>

        <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Session history.
            </h1>

            <p className="mt-3 max-w-2xl leading-relaxed text-slate">
              Review your previous interviews, track your performance,
              and identify how your skills are improving over time.
            </p>
          </div>

          <Link
            to="/sessions/create"
            className="inline-flex shrink-0 items-center justify-center rounded-[4px] bg-focus px-5 py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
          >
            Start session
          </Link>

        </div>

      </section>


      {/* Summary stats */}
      <section className="grid border-b border-hairline sm:grid-cols-3">

        <div className="border-b border-hairline py-8 sm:border-b-0 sm:border-r sm:pr-8">

          <p className="text-sm text-slate">
            Total sessions
          </p>

          <p className="mt-4 font-mono text-4xl font-medium text-ink">
            {sessions.length}
          </p>

          <p className="mt-2 text-sm text-slate">
            Interviews completed
          </p>

        </div>


        <div className="border-b border-hairline py-8 sm:border-b-0 sm:border-r sm:px-8">

          <p className="text-sm text-slate">
            Average score
          </p>

          <p className="mt-4 font-mono text-4xl font-medium text-focus">
            {averageScore}%
          </p>

          <p className="mt-2 text-sm text-slate">
            Across all sessions
          </p>

        </div>


        <div className="py-8 sm:pl-8">

          <p className="text-sm text-slate">
            Best performance
          </p>

          <p className="mt-4 font-mono text-4xl font-medium text-brass">
            {bestScore}%
          </p>

          <p className="mt-2 text-sm text-slate">
            Your highest score
          </p>

        </div>

      </section>


      {/* Search and filters */}
      <section className="border-b border-hairline py-8">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}
          <div className="relative w-full lg:max-w-sm">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search sessions..."
              className="w-full rounded-[4px] border border-hairline bg-paper py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-slate/60 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/10"
            />

          </div>


          {/* Filters */}
          <div className="flex flex-wrap gap-2">

            {filters.map((filter) => {

              const active = activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-[4px] px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-ink text-paper"
                      : "border border-hairline text-slate hover:border-ink/30 hover:text-ink"
                  }`}
                >
                  {filter}
                </button>
              );

            })}

          </div>

        </div>

      </section>


      {/* Session list */}
      <section className="py-10">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-slate">
              Previous interviews
            </p>

            <h2 className="mt-1 text-xl font-semibold text-ink">
              Your sessions
            </h2>

          </div>


          <span className="text-sm text-slate">

            {filteredSessions.length}{" "}

            {filteredSessions.length === 1
              ? "session"
              : "sessions"}

          </span>

        </div>


        {filteredSessions.length > 0 ? (

          <div className="mt-8 border-t border-hairline">

            {filteredSessions.map((session) => (

              <div
                key={session.id}
                className="flex flex-col gap-5 border-b border-hairline py-6 transition-colors hover:bg-ink/[0.02] sm:flex-row sm:items-center sm:justify-between"
              >

                {/* Session information */}
                <div className="flex min-w-0 items-start gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-focus/10">

                    <FileText
                      size={18}
                      className="text-focus"
                    />

                  </div>


                  <div className="min-w-0">

                    <h3 className="truncate text-base font-semibold text-ink">

                      {session.role}

                    </h3>


                    {/* Tags */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">

                      <span className="rounded-[3px] border border-hairline px-2 py-1 text-xs text-slate">

                        {session.type}

                      </span>


                      <span className="rounded-[3px] border border-hairline px-2 py-1 text-xs text-slate">

                        {session.difficulty}

                      </span>

                    </div>


                    {/* Date and duration */}
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate">

                      <span className="flex items-center gap-1.5">

                        <Calendar size={13} />

                        {session.date}

                      </span>


                      <span className="flex items-center gap-1.5">

                        <Clock size={13} />

                        {session.duration}

                      </span>

                    </div>

                  </div>

                </div>


                {/* Score and action */}
                <div className="flex items-center justify-between gap-6 sm:justify-end">

                  <div className="text-left sm:text-right">

                    <p className="text-xs text-slate">
                      {getPerformanceLabel(session.score)}
                    </p>

                    <p
                      className={`mt-1 font-mono text-2xl font-medium ${getScoreTextColor(
                        session.score
                      )}`}
                    >

                      {session.score}%

                    </p>

                  </div>


                  <Link
                    to={`/sessions/${session.id}/result`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-focus transition-opacity hover:opacity-80"
                  >

                    View result

                    <ChevronRight size={16} />

                  </Link>

                </div>

              </div>

            ))}

          </div>

        ) : (

          /* Empty state */

          <div className="mt-8 flex min-h-[300px] flex-col items-center justify-center rounded-[4px] border border-dashed border-hairline px-6 text-center">

            <div className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-ink/5">

              <Search
                size={20}
                className="text-slate"
              />

            </div>


            <h3 className="mt-5 text-base font-semibold text-ink">

              No sessions found

            </h3>


            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate">

              Try changing your search or selecting a different
              interview type.

            </p>


            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
              }}
              className="mt-5 text-sm font-semibold text-focus hover:opacity-80"
            >

              Clear filters

            </button>

          </div>

        )}

      </section>

    </div>
  );
}