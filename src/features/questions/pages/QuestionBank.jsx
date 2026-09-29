
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Code2,
  MessageSquare,
  Users,
  Brain,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import api from "../../../api/axios.js";

const categories = [
  "All",
  "Technical",
  "Behavioral",
  "HR",
  "System Design",
];

const difficulties = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
];

function getDifficultyColor(difficulty) {
  if (difficulty === "Beginner") return "text-focus";
  if (difficulty === "Intermediate") return "text-brass";
  return "text-red-500";
}

function getCategoryIcon(category) {
  if (category === "Technical") return Code2;
  if (category === "Behavioral") return MessageSquare;
  if (category === "HR") return Users;
  return Brain;
}

export default function QuestionBank() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchQuestions = async () => {
      setLoading(true);
      setError("");

      const params = {};

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      if (activeCategory !== "All") {
        params.category = activeCategory;
      }

      if (activeDifficulty !== "All") {
        params.difficulty = activeDifficulty;
      }

      try {
        const response = await api.get(
          "/api/sessions/questions/",
          {
            params,
            signal: controller.signal,
          }
        );

        // Support both normal and paginated DRF responses.
        const data = response.data;
        setQuestions(
          Array.isArray(data) ? data : data.results || []
        );
      } catch (err) {
        if (err.code === "ERR_CANCELED") return;

        console.error("Failed to fetch questions:", err);

        setError(
          err.response?.status === 401
            ? "Please log in to view the question bank."
            : "Unable to load questions. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchQuestions();

    return () => controller.abort();
  }, [searchQuery, activeCategory, activeDifficulty]);

  const handlePractice = (item) => {
    navigate("/sessions/create", {
      state: {
        selectedQuestion: item,
      },
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setActiveDifficulty("All");
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <section className="border-b border-hairline pb-8">
        <p className="text-sm text-slate">
          Interview preparation
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Question bank.
        </h1>

        <p className="mt-3 max-w-2xl leading-relaxed text-slate">
          Explore interview questions across technical,
          behavioral, HR, and system design topics.
          Practice the areas that matter most to you.
        </p>
      </section>

      {/* Search */}
      <section className="border-b border-hairline py-8">
        <div className="relative max-w-xl">
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
            placeholder="Search questions..."
            className="w-full rounded-[4px] border border-hairline bg-paper py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-slate/60 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/10"
          />
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-hairline py-8">
        <div className="space-y-6">
          {/* Category */}
          <div>
            <p className="text-sm font-medium text-ink">
              Category
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => {
                const active = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-[4px] px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-ink text-paper"
                        : "border border-hairline text-slate hover:border-ink/30 hover:text-ink"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <p className="text-sm font-medium text-ink">
              Difficulty
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {difficulties.map((difficulty) => {
                const active =
                  activeDifficulty === difficulty;

                return (
                  <button
                    key={difficulty}
                    type="button"
                    onClick={() =>
                      setActiveDifficulty(difficulty)
                    }
                    className={`rounded-[4px] px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-ink text-paper"
                        : "border border-hairline text-slate hover:border-ink/30 hover:text-ink"
                    }`}
                  >
                    {difficulty}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Question List */}
      <section className="py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate">
              Practice questions
            </p>

            <h2 className="mt-1 text-xl font-semibold text-ink">
              Explore questions
            </h2>
          </div>

          {!loading && !error && (
            <span className="text-sm text-slate">
              {questions.length}{" "}
              {questions.length === 1
                ? "question"
                : "questions"}
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
            <LoaderCircle
              size={28}
              className="animate-spin text-focus"
            />
            <p className="text-sm text-slate">
              Loading questions...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 flex min-h-[250px] flex-col items-center justify-center rounded-[4px] border border-red-200 px-6 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => {
                // Trigger a new request with the current filters.
                setSearchQuery((value) => value);
                setActiveCategory((value) => value);
              }}
              className="mt-4 text-sm font-semibold text-focus hover:opacity-80"
            >
              Change a filter to retry
            </button>
          </div>
        )}

        {/* Questions */}
        {!loading && !error && questions.length > 0 && (
          <div className="mt-8 border-t border-hairline">
            {questions.map((item) => {
              const Icon = getCategoryIcon(item.category);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handlePractice(item)}
                  className="group flex w-full flex-col gap-5 border-b border-hairline py-6 text-left transition-colors hover:bg-ink/[0.02] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-focus/10">
                      <Icon
                        size={18}
                        className="text-focus"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="max-w-3xl text-base font-semibold leading-relaxed text-ink">
                        {item.question}
                      </h3>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-[3px] border border-hairline px-2 py-1 text-xs text-slate">
                          {item.category}
                        </span>

                        <span
                          className={`rounded-[3px] border border-hairline px-2 py-1 text-xs ${getDifficultyColor(
                            item.difficulty
                          )}`}
                        >
                          {item.difficulty}
                        </span>

                        {item.topic && (
                          <span className="rounded-[3px] border border-hairline px-2 py-1 text-xs text-slate">
                            {item.topic}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-focus">
                    Practice
                    <ChevronRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && questions.length === 0 && (
          <div className="mt-8 flex min-h-[300px] flex-col items-center justify-center rounded-[4px] border border-dashed border-hairline px-6 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-ink/5">
              <Search size={20} className="text-slate" />
            </div>

            <h3 className="mt-5 text-base font-semibold text-ink">
              No questions found
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate">
              Try changing your search or filters to
              explore more questions.
            </p>

            <button
              type="button"
              onClick={handleClearFilters}
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