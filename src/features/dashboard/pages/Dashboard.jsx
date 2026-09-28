
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Calendar,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowRight,
  Flame,
  Sparkles,
  Activity,
  RefreshCw,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth.js";
import { getDashboardData } from "../../../api/session.api.js";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
}

function getScoreStyle(score) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 70) return "text-amber-400";
  return "text-red-400";
}

function getProgressColor(score) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 70) return "bg-amber-400";
  return "bg-blue-600";
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDateKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getStreak(sessions) {
  const dates = [
    ...new Set(
      sessions
        .filter((s) => s.status === "Completed")
        .map((s) => getDateKey(s.created_at))
    ),
  ].sort().reverse();

  if (!dates.length) return 0;

  const today = new Date();
  const todayKey = getDateKey(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getDateKey(yesterday);

  if (dates[0] !== todayKey && dates[0] !== yesterdayKey) return 0;

  let streak = 0;
  const current = new Date(`${dates[0]}T00:00:00`);

  for (const date of dates) {
    if (getDateKey(current) !== date) break;
    streak++;
    current.setDate(current.getDate() - 1);
  }

  return streak;
}

function getMonthlyChange(sessions) {
  const now = new Date();

  const thisMonth = sessions.filter((s) => {
    const d = new Date(s.created_at);
    return (
      s.status === "Completed" &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear() &&
      s.score !== null
    );
  });

  const previousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  const lastMonth = sessions.filter((s) => {
    const d = new Date(s.created_at);
    return (
      s.status === "Completed" &&
      d.getMonth() === previousMonth.getMonth() &&
      d.getFullYear() === previousMonth.getFullYear() &&
      s.score !== null
    );
  });

  if (!thisMonth.length || !lastMonth.length) return null;

  const currentAvg =
    thisMonth.reduce((sum, s) => sum + s.score, 0) / thisMonth.length;
  const previousAvg =
    lastMonth.reduce((sum, s) => sum + s.score, 0) / lastMonth.length;

  const change = Math.round(currentAvg - previousAvg);
  return `${change > 0 ? "+" : ""}${change}% from last month`;
}

function MetricCard({ title, value, subtitle, icon: Icon, accent = "blue" }) {
  const accents = {
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-emerald-500/10 text-emerald-400",
    amber: "bg-amber-500/10 text-amber-400",
  };

  return (
    <div className="group rounded-2xl border border-[#303947] bg-[#1B1D20] p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/40 hover:bg-[#202329] hover:shadow-lg hover:shadow-black/20 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${accents[accent]}`}
        >
          <Icon size={19} strokeWidth={1.9} />
        </div>
      </div>

      <div className="mt-5 font-mono text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {value}
      </div>

      <p className="mt-2 text-xs leading-relaxed text-gray-400">
        {subtitle}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const username = user?.username || "User";

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");
        setSessions([]);

        const response = await getDashboardData();
        const data = Array.isArray(response.data) ? response.data : [];

        const updated = data
          .map((session) => ({
            ...session,
            score:
              session.score === null || session.score === undefined
                ? null
                : Number(session.score),
            categoryScores: Array.isArray(session.categoryScores)
              ? session.categoryScores
                  .filter(
                    (item) =>
                      item.score !== null &&
                      item.score !== undefined &&
                      Number.isFinite(Number(item.score))
                  )
                  .map((item) => ({
                    ...item,
                    score: Number(item.score),
                  }))
              : [],
          }))
          .sort(
            (a, b) =>
              new Date(b.created_at) - new Date(a.created_at)
          );

        if (!cancelled) setSessions(updated);
      } catch (err) {
        if (!cancelled) {
          setSessions([]);
          setError(
            err.response?.data?.detail ||
              err.response?.data?.error ||
              "Unable to load dashboard data. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [retry]);

  const completedSessions = sessions.filter(
    (s) => s.status === "Completed"
  );

  const scoredSessions = completedSessions.filter(
    (s) => s.score !== null && Number.isFinite(s.score)
  );

  const overallScore = scoredSessions.length
    ? Math.round(
        scoredSessions.reduce((sum, s) => sum + s.score, 0) /
          scoredSessions.length
      )
    : null;

  const now = new Date();
  const weekStart = new Date(now);
  const day = (now.getDay() + 6) % 7;
  weekStart.setDate(now.getDate() - day);
  weekStart.setHours(0, 0, 0, 0);

  const thisWeek = completedSessions.filter(
    (s) => new Date(s.created_at) >= weekStart
  ).length;

  const categoryAverages = [
    { label: "Technical skills" },
    { label: "Communication" },
    { label: "Problem solving" },
  ]
    .map(({ label }) => {
      const values = completedSessions.flatMap((s) =>
        (s.categoryScores || [])
          .filter((c) => c.label === label)
          .map((c) => c.score)
          .filter((score) => Number.isFinite(score))
      );

      return {
        label,
        score: values.length
          ? values.reduce((sum, value) => sum + value, 0) / values.length
          : null,
      };
    })
    .filter((item) => item.score !== null);

  const weakestArea = [...categoryAverages].sort(
    (a, b) => a.score - b.score
  )[0];

  const monthlyChange = getMonthlyChange(scoredSessions);
  const streak = getStreak(completedSessions);
  const recentSessions = sessions.slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-6 pb-8 sm:space-y-8">
      {/* Welcome section */}
      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[#303947] bg-[#1B1D20] p-5 shadow-sm sm:flex-row sm:items-center sm:p-7">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
            <Sparkles size={14} />
            Your interview workspace
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {getGreeting()}, {username}.
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
            Track your progress, identify your weak areas, and sharpen
            your interview performance.
          </p>
        </div>

        <Link
          to="/sessions/create"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
        >
          <Sparkles size={17} />
          Start interview
        </Link>
      </section>

      {/* Error message */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setRetry((prev) => prev + 1)}
            disabled={loading}
            className="inline-flex w-fit items-center gap-2 font-semibold underline underline-offset-4 disabled:opacity-50"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      )}

      {/* Metrics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Overall score"
          value={
            loading
              ? "..."
              : overallScore === null
                ? "—"
                : `${overallScore}%`
          }
          subtitle={
            loading
              ? "Calculating your score..."
              : monthlyChange || "Average of completed interviews"
          }
          icon={Target}
          accent="blue"
        />

        <MetricCard
          title="Sessions completed"
          value={loading ? "..." : completedSessions.length}
          subtitle={
            loading
              ? "Loading your sessions..."
              : `${thisWeek} ${thisWeek === 1 ? "session" : "sessions"} this week`
          }
          icon={Calendar}
          accent="green"
        />

        <MetricCard
          title="Current streak"
          value={
            loading
              ? "..."
              : `${streak} ${streak === 1 ? "day" : "days"}`
          }
          subtitle={
            loading
              ? "Calculating your streak..."
              : streak > 0
                ? "Keep the momentum going."
                : "Complete an interview to start your streak."
          }
          icon={Flame}
          accent="amber"
        />
      </section>

      {/* Performance and focus */}
      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Performance breakdown */}
        <div className="rounded-2xl border border-[#303947] bg-[#1B1D20] p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <Activity size={15} className="text-blue-400" />
                Analytics
              </div>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                Performance breakdown
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Your average score in each skill area.
              </p>
            </div>

            <div className="hidden rounded-xl bg-blue-500/10 p-2.5 text-blue-400 sm:block">
              <TrendingUp size={19} />
            </div>
          </div>

          <div className="mt-7 space-y-6">
            {loading ? (
              <div className="space-y-5">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="animate-pulse space-y-3">
                    <div className="h-4 w-40 rounded bg-slate-700/50" />
                    <div className="h-2.5 rounded-full bg-slate-700/50" />
                  </div>
                ))}
              </div>
            ) : categoryAverages.length === 0 ? (
              <div className="rounded-xl bg-[#22252A] px-4 py-8 text-center">
                <Target size={26} className="mx-auto text-gray-500" />
                <p className="mt-3 text-sm font-medium text-white">
                  No performance data yet
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Complete an interview to see your skill breakdown.
                </p>
              </div>
            ) : (
              categoryAverages.map((category) => (
                <div key={category.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-gray-200">
                      {category.label}
                    </span>
                    <span
                      className={`font-mono text-sm font-semibold ${getScoreStyle(category.score)}`}
                    >
                      {Math.round(category.score)}%
                    </span>
                  </div>

                  <div
                    className="h-2.5 overflow-hidden rounded-full bg-[#30343B]"
                    role="progressbar"
                    aria-label={category.label}
                    aria-valuenow={Math.round(category.score)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${getProgressColor(category.score)}`}
                      style={{
                        width: `${Math.max(0, Math.min(100, category.score))}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-7 border-t border-[#303947] pt-4">
            <p className="text-xs leading-relaxed text-gray-400">
              Scores are averages from your completed interviews.
            </p>
          </div>
        </div>

        {/* Recommended focus */}
        <div className="relative flex flex-col overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-[#202329] via-[#1B1D20] to-[#15264B] p-5 shadow-sm sm:p-6">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />

          <div className="relative flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <Target size={15} />
            Recommended focus
          </div>

          <div className="relative mt-6">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              {weakestArea ? "Build your next skill." : "Keep practicing."}
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              {loading
                ? "Analyzing your interview performance..."
                : weakestArea
                  ? `Your lowest current average is ${weakestArea.label.toLowerCase()}. Consider focusing on it in your next interview.`
                  : "Complete some interviews to discover which areas you can improve."}
            </p>
          </div>

          {weakestArea && !loading && (
            <div className="relative mt-6 rounded-xl border border-blue-500/25 bg-[#1B1D20]/80 p-4">
              <p className="text-xs font-medium text-gray-400">
                Lowest average
              </p>

              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-white">
                  {weakestArea.label}
                </span>
                <span
                  className={`font-mono text-xl font-semibold ${getScoreStyle(weakestArea.score)}`}
                >
                  {Math.round(weakestArea.score)}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#30343B]">
                <div
                  className={`h-full rounded-full ${getProgressColor(weakestArea.score)}`}
                  style={{
                    width: `${Math.max(0, Math.min(100, weakestArea.score))}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="relative mt-auto pt-7">
            <Link
              to="/sessions/create"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Practice now
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent sessions */}
      <section className="overflow-hidden rounded-2xl border border-[#303947] bg-[#1B1D20] shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-[#303947] p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <Clock size={15} className="text-blue-400" />
              Your activity
            </div>

            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
              Recent sessions
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              A quick look at your latest interviews.
            </p>
          </div>

          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
          >
            View all
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="h-4 w-36 rounded bg-slate-700/50" />
                  <div className="h-3 w-24 rounded bg-slate-700/50" />
                </div>
                <div className="h-7 w-12 rounded bg-slate-700/50" />
              </div>
            ))}
          </div>
        ) : recentSessions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <Calendar size={22} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              No sessions yet
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-gray-400">
              Start your first interview to begin tracking your progress.
            </p>

            <Link
              to="/sessions/create"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Start your first session
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#303947]">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-[#22252A] sm:px-6"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#252B36] text-blue-400">
                    <Target size={18} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-white">
                      {session.role || "Interview"}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      <span>{formatDate(session.created_at)}</span>
                      <span className="text-gray-600">•</span>
                      <span>{session.difficulty || "Standard"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 sm:gap-5">
                  <span
                    className={`hidden rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex ${
                      session.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {session.status}
                  </span>

                  <span
                    className={`min-w-[45px] text-right font-mono text-lg font-semibold ${
                      session.score === null
                        ? "text-gray-500"
                        : getScoreStyle(session.score)
                    }`}
                  >
                    {session.score === null ? "—" : `${session.score}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-[#303947] bg-[#202329] px-5 py-3 sm:px-6">
          <p className="text-xs text-gray-400">
            Your three most recent sessions, including pending sessions.
          </p>
        </div>
      </section>
    </div>
  );
}