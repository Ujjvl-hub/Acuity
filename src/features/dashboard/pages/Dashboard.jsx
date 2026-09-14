import { Link } from "react-router-dom";
import { Target, Calendar, TrendingUp, Clock } from "lucide-react";

const recentSessions = [
  { role: "Software Engineer", date: "Sep 12, 2026", score: 82, status: "Strong" },
  { role: "Frontend Developer", date: "Sep 10, 2026", score: 76, status: "Improving" },
  { role: "Backend Developer", date: "Sep 8, 2026", score: 68, status: "Needs work" },
];

function getScoreStyle(score) {
  if (score >= 80) return "text-focus";
  if (score >= 70) return "text-brass";
  return "text-red-500";
}

export default function Dashboard() {
  return (
    <div>
      {/* Page header */}
      <section className="flex flex-col gap-6 border-b border-hairline pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Good morning, Ujjwal.
          </h1>
          <p className="mt-3 max-w-xl text-slate leading-relaxed">
            Track your progress, identify your weak areas, and sharpen your
            interview performance.
          </p>
        </div>

        <Link
          to="/sessions/create"
          className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-focus px-5 py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
        >
          Start session
        </Link>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 border-b border-hairline sm:grid-cols-3">
        <div className="border-b border-hairline py-8 sm:border-b-0 sm:border-r sm:pr-8">
          <div className="flex items-center gap-2 text-sm text-slate">
            <Target size={16} />
            Overall score
          </div>
          <div className="mt-4 font-mono text-4xl font-medium text-focus">78%</div>
          <p className="mt-2 text-sm text-slate">+6% from last month</p>
        </div>

        <div className="border-b border-hairline py-8 sm:border-b-0 sm:border-r sm:px-8">
          <div className="flex items-center gap-2 text-sm text-slate">
            <Calendar size={16} />
            Sessions completed
          </div>
          <div className="mt-4 font-mono text-4xl font-medium text-ink">12</div>
          <p className="mt-2 text-sm text-slate">3 sessions this week</p>
        </div>

        <div className="py-8 sm:pl-8">
          <div className="flex items-center gap-2 text-sm text-slate">
            <TrendingUp size={16} />
            Current streak
          </div>
          <div className="mt-4 font-mono text-4xl font-medium text-brass">6 days</div>
          <p className="mt-2 text-sm text-slate">Keep the momentum going.</p>
        </div>
      </section>

      {/* Main content */}
      <section className="grid gap-8 py-10 lg:grid-cols-[1fr_1.4fr]">
        {/* Continue practicing */}
        <div className="border border-hairline rounded-[4px] p-6">
          <p className="text-sm text-slate">Next session</p>
          <h2 className="mt-2 text-xl font-semibold text-ink">Keep practicing.</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate">
            Your recent sessions show that system design and communication are
            the areas that need the most attention.
          </p>

          <div className="mt-6 border-t border-hairline pt-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate">Recommended focus</span>
              <span className="font-mono text-sm text-focus">System design</span>
            </div>
          </div>

          <Link
            to="/sessions/create"
            className="mt-6 inline-block text-sm font-semibold text-focus hover:opacity-80"
          >
            Start practicing
          </Link>
        </div>

        {/* Recent sessions */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate">Performance</p>
              <h2 className="mt-1 text-xl font-semibold text-ink">Recent sessions</h2>
            </div>
            <Link to="/history" className="text-sm font-medium text-focus hover:opacity-80">
              View all
            </Link>
          </div>

          <div className="mt-5 border-t border-hairline">
            {recentSessions.map((session) => (
              <div
                key={`${session.role}-${session.date}`}
                className="flex items-center justify-between gap-4 border-b border-hairline py-5"
              >
                <div>
                  <h3 className="text-sm font-semibold text-ink">{session.role}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate">
                    <Clock size={13} />
                    {session.date}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="hidden text-xs text-slate sm:block">{session.status}</span>
                  <span className={`font-mono text-xl font-medium ${getScoreStyle(session.score)}`}>
                    {session.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom section */}
      <section className="border-t border-hairline pt-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate">Practice consistency</p>
            <h2 className="mt-1 text-xl font-semibold text-ink">Small sessions. Better results.</h2>
            <p className="mt-2 text-sm text-slate">
              Practice consistently to improve your interview performance.
            </p>
          </div>

          <Link to="/sessions/create" className="text-sm font-semibold text-focus hover:opacity-80">
            Schedule a session
          </Link>
        </div>
      </section>
    </div>
  );
}