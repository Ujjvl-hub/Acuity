import {
  Target,
  Activity,
  Briefcase,
  TrendingUp,
} from "lucide-react";

import { Link } from "react-router-dom";
import logo from "../../../assets/logo.jpg";


const STATS = [
  {
    value: "12,400+",
    label: "mock interviews completed",
  },
  {
    value: "87%",
    label: "felt more confident after 3 sessions",
  },
  {
    value: "40+",
    label: "roles covered",
  },
];


const FEATURES = [
  {
    icon: Target,
    title: "Adaptive difficulty",
    body: "Each question is picked based on how you answered the last one — not a fixed script.",
  },
  {
    icon: Activity,
    title: "Real evaluation",
    body: "Every answer is scored on clarity, structure, and correctness, not just keyword matching.",
  },
  {
    icon: Briefcase,
    title: "Practice by role",
    body: "Upload a resume or job description and get questions grounded in what you'd actually face.",
  },
  {
    icon: TrendingUp,
    title: "Weak areas, tracked",
    body: "See which topics keep tripping you up across sessions, not just within one.",
  },
];


const STEPS = [
  {
    n: "1",
    title: "Pick a role",
    body: "Choose a target role and difficulty, or upload a resume for context.",
  },
  {
    n: "2",
    title: "Answer, adapt",
    body: "Questions adjust in real time based on how you're doing.",
  },
  {
    n: "3",
    title: "See the gaps",
    body: "Get a scored breakdown and a plan for what to practice next.",
  },
];


export default function Home() {
  return (
    <div className="bg-paper text-ink">

      {/* ================= HEADER ================= */}

      <header className="border-b border-hairline">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

          {/* Logo */}

          <Link to="/" className="flex items-center gap-2">

            <img src={logo} alt="Acuity logo" className="h-7 w-7 rounded-[4px] object-contain" />

            <span className="text-[17px] font-semibold tracking-tight">
              Acuity
            </span>

          </Link>


          {/* Navigation */}

          <div className="flex items-center gap-6">

            <a
              href="#how-it-works"
              className="text-sm text-slate transition-colors hover:text-ink"
            >
              How it works
            </a>


            <Link
              to="/login"
              className="text-sm text-slate transition-colors hover:text-ink"
            >
              Log in
            </Link>


            <Link
              to="/register"
              className="rounded-[4px] bg-focus px-4 py-2 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
            >
              Start free
            </Link>

          </div>

        </div>
      </header>


      {/* ================= HERO ================= */}

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20">

        <div className="max-w-3xl">

          {/* Eye-chart style heading */}

          <h1 className="tracking-tight">

            <span className="block text-5xl font-semibold leading-[0.95] sm:text-6xl md:text-7xl lg:text-[76px]">
              See the gaps
            </span>


            <span className="mt-3 block text-3xl font-semibold leading-[1] text-slate sm:text-4xl md:text-5xl lg:text-[52px]">
              before the interviewer
            </span>


            <span className="mt-3 block text-2xl font-medium leading-[1] text-slate sm:text-3xl lg:text-[34px]">
              does.
            </span>

          </h1>


          {/* Description */}

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate">
            Acuity runs adaptive mock interviews, scores every answer
            against a real rubric, and shows you exactly what to fix
            before the actual thing.
          </p>


          {/* CTA Buttons */}

          <div className="mt-8 flex flex-wrap items-center gap-3">

            <Link
              to="/register"
              className="rounded-[4px] bg-focus px-5 py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
            >
              Start a mock interview
            </Link>


            <a
              href="#how-it-works"
              className="rounded-[4px] border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
            >
              See how it works
            </a>

          </div>

        </div>


        {/* ================= STATS ================= */}

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[4px] border border-hairline bg-hairline sm:grid-cols-3">

          {STATS.map((stat) => (

            <div
              key={stat.label}
              className="bg-paper px-6 py-5"
            >

              <div className="font-mono text-3xl font-medium text-focus">
                {stat.value}
              </div>

              <div className="mt-1 text-sm text-slate">
                {stat.label}
              </div>

            </div>

          ))}

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="mx-auto max-w-6xl border-t border-hairline px-6 py-16">

        <h2 className="max-w-md text-2xl font-semibold">
          Practice that adjusts to you, not a script.
        </h2>


        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">

          {FEATURES.map((feature) => {

            const Icon = feature.icon;

            return (

              <div
                key={feature.title}
                className="flex gap-4 rounded-[4px] border border-hairline p-5"
              >

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-hairline">

                  <Icon
                    size={17}
                    strokeWidth={2}
                    className="text-focus"
                  />

                </div>


                <div>

                  <div className="text-[15px] font-semibold">
                    {feature.title}
                  </div>


                  <p className="mt-1 text-sm leading-relaxed text-slate">
                    {feature.body}
                  </p>

                </div>

              </div>

            );

          })}

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section
        id="how-it-works"
        className="mx-auto max-w-6xl border-t border-hairline px-6 py-16"
      >

        <h2 className="max-w-md text-2xl font-semibold">
          Three steps, no fluff.
        </h2>


        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">

          {STEPS.map((step) => (

            <div key={step.n}>

              <div className="font-mono text-sm font-medium text-brass">
                {step.n}
              </div>


              <div className="mt-2 text-[15px] font-semibold">
                {step.title}
              </div>


              <p className="mt-1 text-sm leading-relaxed text-slate">
                {step.body}
              </p>

            </div>

          ))}

        </div>

      </section>


      {/* ================= CLOSING CTA ================= */}

      <section className="bg-ink text-paper">

        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 sm:flex-row sm:items-center">

          <div>

            <h3 className="text-2xl font-semibold">
              Find out what you'd actually say.
            </h3>


            <p className="mt-2 text-paper/60">
              Your first session is free — no card needed.
            </p>

          </div>


          <Link
            to="/register"
            className="shrink-0 rounded-[4px] bg-focus px-5 py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
          >
            Start a mock interview
          </Link>

        </div>

      </section>

    </div>
  );
}