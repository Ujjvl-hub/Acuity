import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Code2,
  MessageSquare,
  Users,
  Brain,
  ChevronRight,
} from "lucide-react";

const questions = [
  {
    id: 1,
    question: "What is the difference between a process and a thread?",
    category: "Technical",
    difficulty: "Beginner",
  },
  {
    id: 2,
    question: "Explain how the event loop works in JavaScript.",
    category: "Technical",
    difficulty: "Intermediate",
  },
  {
    id: 3,
    question: "What happens when you enter a URL in the browser?",
    category: "Technical",
    difficulty: "Intermediate",
  },
  {
    id: 4,
    question: "Explain the difference between REST and GraphQL.",
    category: "Technical",
    difficulty: "Intermediate",
  },
  {
    id: 5,
    question:
      "Tell me about a challenging problem you faced and how you solved it.",
    category: "Behavioral",
    difficulty: "Intermediate",
  },
  {
    id: 6,
    question:
      "Describe a situation where you had to work with a difficult team member.",
    category: "Behavioral",
    difficulty: "Intermediate",
  },
  {
    id: 7,
    question: "Why do you want to work for this company?",
    category: "HR",
    difficulty: "Beginner",
  },
  {
    id: 8,
    question: "Where do you see yourself in the next five years?",
    category: "HR",
    difficulty: "Beginner",
  },
  {
    id: 9,
    question:
      "How would you design a scalable URL shortening service?",
    category: "System Design",
    difficulty: "Advanced",
  },
  {
    id: 10,
    question:
      "How would you design a notification system for millions of users?",
    category: "System Design",
    difficulty: "Advanced",
  },
];

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
  if (difficulty === "Beginner") {
    return "text-focus";
  }

  if (difficulty === "Intermediate") {
    return "text-brass";
  }

  return "text-red-500";
}

function getCategoryIcon(category) {
  if (category === "Technical") {
    return Code2;
  }

  if (category === "Behavioral") {
    return MessageSquare;
  }

  if (category === "HR") {
    return Users;
  }

  return Brain;
}

export default function QuestionBank() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState("All");

  const filteredQuestions = useMemo(() => {
    return questions.filter((item) => {
      const matchesSearch = item.question
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        item.category === activeCategory;

      const matchesDifficulty =
        activeDifficulty === "All" ||
        item.difficulty === activeDifficulty;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty
      );
    });
  }, [
    searchQuery,
    activeCategory,
    activeDifficulty,
  ]);

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

        <div className="mt-2">

          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Question bank.
          </h1>

          <p className="mt-3 max-w-2xl leading-relaxed text-slate">
            Explore interview questions across technical,
            behavioral, HR, and system design topics.
            Practice the areas that matter most to you.
          </p>

        </div>

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

                const active =
                  activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setActiveCategory(category)
                    }
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


          <span className="text-sm text-slate">

            {filteredQuestions.length}{" "}

            {filteredQuestions.length === 1
              ? "question"
              : "questions"}

          </span>

        </div>


        {filteredQuestions.length > 0 ? (

          <div className="mt-8 border-t border-hairline">

            {filteredQuestions.map((item) => {

              const Icon =
                getCategoryIcon(item.category);

              return (

                <button
                  key={item.id}
                  type="button"
                  onClick={() => handlePractice(item)}
                  className="group flex w-full flex-col gap-5 border-b border-hairline py-6 text-left transition-colors hover:bg-ink/[0.02] sm:flex-row sm:items-center sm:justify-between"
                >

                  {/* Question */}
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

                      </div>

                    </div>

                  </div>


                  {/* Practice */}
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

        ) : (

          <div className="mt-8 flex min-h-[300px] flex-col items-center justify-center rounded-[4px] border border-dashed border-hairline px-6 text-center">

            <div className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-ink/5">

              <Search
                size={20}
                className="text-slate"
              />

            </div>


            <h3 className="mt-5 text-base font-semibold text-ink">

              No questions found

            </h3>


            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate">

              Try changing your search or filters
              to explore more questions.

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