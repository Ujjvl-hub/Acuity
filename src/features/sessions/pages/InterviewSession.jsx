import { useState } from "react";
import {
  Clock,
  Mic,
  Send,
  ChevronLeft,
  MoreHorizontal,
} from "lucide-react";

const questions = [
  {
    id: 1,
    text: "Explain the difference between a process and a thread. When would you prefer using multiple threads instead of multiple processes?",
  },
  {
    id: 2,
    text: "What happens internally when you type a URL into your browser and press Enter?",
  },
  {
    id: 3,
    text: "Explain the difference between a REST API and a GraphQL API. When would you choose one over the other?",
  },
  {
    id: 4,
    text: "What is database indexing, and how does it improve query performance?",
  },
  {
    id: 5,
    text: "Explain the difference between authentication and authorization with a real-world example.",
  },
  {
    id: 6,
    text: "What is the difference between SQL and NoSQL databases?",
  },
  {
    id: 7,
    text: "Explain how you would improve the performance of a slow web application.",
  },
  {
    id: 8,
    text: "What is caching, and where can caching be implemented in a web application?",
  },
  {
    id: 9,
    text: "Explain the concept of horizontal and vertical scaling.",
  },
  {
    id: 10,
    text: "Describe a challenging technical problem you solved and explain your approach.",
  },
];

export default function InterviewSession() {
  const [answer, setAnswer] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const totalQuestions = questions.length;

  const questionNumber = questionIndex + 1;

  const question = questions[questionIndex];

  const progress = (questionNumber / totalQuestions) * 100;

  const handleSubmit = async () => {
    if (!answer.trim() || submitting) return;

    setSubmitting(true);

    try {
      // Temporary mock AI evaluation
      // Later:
      // 1. Send answer to Django backend
      // 2. AI evaluates the answer
      // 3. Backend generates the next adaptive question

      console.log({
        questionId: question.id,
        question: question.text,
        answer,
      });

      await new Promise((resolve) => setTimeout(resolve, 1200));

      setAnswer("");

      if (questionIndex < totalQuestions - 1) {
        setQuestionIndex((prev) => prev + 1);
      } else {
        console.log("Interview completed!");

        // Later:
        // navigate("/sessions/:id/result");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isLastQuestion = questionIndex === totalQuestions - 1;

  return (
    <div className="mx-auto max-w-5xl">

      {/* Top section */}
      <section className="border-b border-hairline pb-6">

        <div className="flex items-center justify-between gap-4">

          {/* Left */}
          <div className="flex items-center gap-4">

            <button
              className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-hairline text-slate transition-colors hover:border-ink hover:text-ink"
              title="Leave interview"
            >
              <ChevronLeft size={18} />
            </button>

            <div>
              <p className="text-sm font-medium text-ink">
                Software Engineer Interview
              </p>

              <div className="mt-1.5 flex items-center gap-1.5">

                <span className="rounded-[3px] border border-hairline px-1.5 py-0.5 text-xs text-slate">
                  Technical
                </span>

                <span className="rounded-[3px] border border-hairline px-1.5 py-0.5 text-xs text-slate">
                  Intermediate
                </span>

              </div>
            </div>

          </div>

          {/* Right */}
          <button
            className="text-slate transition-colors hover:text-ink"
            title="More options"
          >
            <MoreHorizontal size={20} />
          </button>

        </div>


        {/* Progress */}
        <div className="mt-6">

          <div className="flex items-center justify-between text-sm">

            <span className="text-slate">
              Progress
            </span>

            <span className="font-mono text-ink">
              {questionNumber} / {totalQuestions}
            </span>

          </div>

          <div className="mt-2 h-[3px] w-full overflow-hidden bg-hairline">

            <div
              className="h-full bg-focus transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      </section>


      {/* Interview workspace */}
      <section className="py-10">

        {/* Question label */}
        <div className="flex items-center gap-3">

          <span className="font-mono text-sm text-brass">
            {String(questionNumber).padStart(2, "0")}
          </span>

          <span className="text-sm text-slate">
            Current question
          </span>

        </div>


        {/* Question */}
        <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          {question.text}
        </h1>


        <div className="my-10 border-t border-hairline" />


        {/* Answer section */}
        <div>

          <div className="flex items-center justify-between">

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
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitting}
              placeholder="Start typing your answer..."
              className="min-h-[220px] w-full resize-none rounded-[4px] border border-hairline bg-paper px-4 py-4 text-sm leading-relaxed text-ink placeholder:text-slate/50 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/10 disabled:opacity-60"
            />

            <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-slate">

              <Mic size={14} />

              <span className="hidden sm:inline">
                Voice input coming soon
              </span>

            </div>

          </div>

        </div>


        {/* Bottom controls */}
        <div className="mt-6 flex flex-col gap-5 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">

          {/* Timer */}
          <div className="flex items-center gap-2">

            <Clock
              size={17}
              className="text-brass"
            />

            <div>

              <p className="text-xs text-slate">
                Time elapsed
              </p>

              <p className="font-mono text-lg font-medium text-ink">
                01:42
              </p>

            </div>

          </div>


          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!answer.trim() || submitting}
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


      {/* Interview status */}
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
              ? "Acuity is evaluating your answer and preparing the next question."
              : isLastQuestion
              ? "This is your final question."
              : "Ready for your answer."}

          </p>

        </div>

      </section>

    </div>
  );
}