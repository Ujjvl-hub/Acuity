import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Target,
} from "lucide-react";

const targetRoles = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "DevOps Engineer",
];

const initialStrengths = [
  "Clear technical skills section.",
  "Relevant programming languages and technologies are listed.",
  "Projects demonstrate practical development experience.",
];

const initialImprovements = [
  "Add more measurable achievements to project descriptions.",
  "Use stronger action verbs to describe your contributions.",
  "Optimize keywords based on the target job role.",
];

function getScoreLabel(score) {
  if (score >= 80) return "Strong";
  if (score >= 65) return "Good";
  return "Needs work";
}

function getScoreColor(score) {
  if (score >= 80) return "text-focus";
  if (score >= 65) return "text-brass";
  return "text-red-500";
}

function getScoreBarColor(score) {
  if (score >= 80) return "bg-focus";
  if (score >= 65) return "bg-brass";
  return "bg-red-500";
}

export default function ResumeManager() {
  const fileInputRef = useRef(null);

  const [resume, setResume] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [fileError, setFileError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const atsScore = 78;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setFileError("Please upload a PDF file.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setFileError("");
    setResume(file);
    setAnalysisComplete(false);
  };

  const handleRemoveResume = () => {
    setResume(null);
    setFileError("");
    setAnalysisComplete(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReplaceResume = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!resume || !targetRole || analyzing) return;

    setAnalyzing(true);
    setAnalysisComplete(false);

    try {
      /*
        Backend integration later:

        1. Upload PDF to backend
        2. Extract resume text
        3. Send resume + target role to GenAI
        4. Receive ATS score
        5. Receive strengths and improvements
      */

      await new Promise((resolve) => setTimeout(resolve, 1800));

      setAnalysisComplete(true);
    } catch (error) {
      console.error("Resume analysis failed:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const scoreLabel = getScoreLabel(atsScore);
  const scoreColor = getScoreColor(atsScore);
  const scoreBarColor = getScoreBarColor(atsScore);

  const canAnalyze = resume && targetRole && !analyzing;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <section className="border-b border-hairline pb-8">
        <p className="text-sm text-slate">Career preparation</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Your resume.
        </h1>

        <p className="mt-3 max-w-2xl leading-relaxed text-slate">
          Upload your resume and get structured feedback to improve its
          clarity, impact, and job readiness.
        </p>
      </section>

      {/* Upload */}
      <section className="py-10">
        <div>
          <p className="text-sm font-medium text-ink">
            Resume document
          </p>

          <p className="mt-1 text-sm text-slate">
            Upload your latest resume in PDF format.
          </p>
        </div>

        {!resume ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-6 flex min-h-[230px] w-full flex-col items-center justify-center rounded-[4px] border border-dashed border-hairline px-6 text-center transition-colors hover:border-focus hover:bg-focus/5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-focus/10">
              <Upload size={20} className="text-focus" />
            </div>

            <p className="mt-5 text-sm font-semibold text-ink">
              Upload your resume
            </p>

            <p className="mt-2 text-sm text-slate">
              PDF files only
            </p>

            <span className="mt-5 rounded-[4px] bg-focus px-4 py-2 text-sm font-semibold text-paper">
              Choose file
            </span>
          </button>
        ) : (
          <div className="mt-6 flex flex-col gap-5 rounded-[4px] border border-hairline p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] bg-focus/10">
                <FileText size={20} className="text-focus" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {resume.name}
                </p>

                <p className="mt-1 text-xs text-slate">
                  {(resume.size / 1024 / 1024).toFixed(2)} MB · PDF
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReplaceResume}
                className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-hairline px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-ink"
              >
                <RefreshCw size={16} />
                Replace
              </button>

              <button
                type="button"
                onClick={handleRemoveResume}
                className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-hairline px-3 py-2 text-sm font-medium text-slate transition-colors hover:border-red-300 hover:text-red-500"
              >
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          </div>
        )}

        {fileError && (
          <p className="mt-3 rounded-[4px] border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {fileError}
          </p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Target Role */}
        <div className="mt-10 border-t border-hairline pt-8">
          <div className="flex items-center gap-2">
            <Target size={17} className="text-focus" />

            <p className="text-sm font-medium text-ink">
              Target role
            </p>
          </div>

          <p className="mt-2 text-sm text-slate">
            Choose the role you want your resume to be evaluated for.
          </p>

          <div className="mt-5">
            <select
              value={targetRole}
              onChange={(event) => {
                setTargetRole(event.target.value);
                setAnalysisComplete(false);
              }}
              className="w-full rounded-[4px] border border-hairline bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-focus focus:ring-2 focus:ring-focus/10"
            >
              <option value="">
                Select your target role
              </option>

              {targetRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Analyze */}
        {resume && (
          <div className="mt-8 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-ink">
                Ready for analysis.
              </p>

              <p className="mt-1 text-sm text-slate">
                Acuity will evaluate your resume based on your target role.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-focus px-5 py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {analyzing && (
                <Loader2 size={16} className="animate-spin" />
              )}

              {analyzing
                ? "Analyzing..."
                : "Analyze resume"}
            </button>
          </div>
        )}
      </section>

      {/* Analysis Results */}
      {analysisComplete && (
        <>
          {/* Analysis status */}
          <section className="border-t border-hairline py-5">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-focus" />

              <p className="text-sm text-slate">
                Analysis complete for{" "}
                <span className="font-medium text-ink">
                  {targetRole}
                </span>
                .
              </p>
            </div>
          </section>

          {/* Score */}
          <section className="grid border-y border-hairline py-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="text-sm text-slate">
                Resume score
              </p>

              <div className="mt-5 flex items-end gap-2">
                <span
                  className={`font-mono text-7xl font-medium ${scoreColor}`}
                >
                  {atsScore}
                </span>

                <span className="mb-2 font-mono text-xl text-slate">
                  /100
                </span>
              </div>

              <p className={`mt-3 text-sm font-medium ${scoreColor}`}>
                {scoreLabel}
              </p>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate">
                Your resume has a strong foundation. Improving keyword
                relevance and measurable achievements could increase its
                effectiveness.
              </p>
            </div>

            {/* Score interpretation */}
            <div className="mt-10 lg:mt-0">
              <p className="text-sm font-medium text-ink">
                Score interpretation
              </p>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate">
                    ATS readiness
                  </span>

                  <span className={`font-mono font-medium ${scoreColor}`}>
                    {atsScore}%
                  </span>
                </div>

                <div className="mt-3 h-[4px] w-full overflow-hidden bg-hairline">
                  <div
                    className={`h-full transition-all duration-500 ${scoreBarColor}`}
                    style={{ width: `${atsScore}%` }}
                  />
                </div>

                <div className="mt-5 flex justify-between text-xs text-slate">
                  <span>Needs work</span>
                  <span>Good</span>
                  <span>Strong</span>
                </div>
              </div>
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
                  What's working
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {initialStrengths.map((item) => (
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
                  Opportunities to improve
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {initialImprovements.map((item) => (
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

          {/* Acuity Insight */}
          <section className="border-b border-hairline py-10">
            <div className="rounded-[4px] border border-focus/20 bg-focus/5 p-6">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-focus" />

                <p className="text-sm font-semibold text-ink">
                  Acuity insight
                </p>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate">
                Your technical profile is clear, but your projects can make a
                stronger impact by highlighting measurable results. Instead of
                only listing technologies, explain what you built, the problem
                you solved, and the outcome.
              </p>
            </div>
          </section>

          {/* Next Step */}
          <section className="py-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm text-slate">
                  Recommended next step
                </p>

                <h2 className="mt-1 text-xl font-semibold text-ink">
                  Improve project descriptions.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate">
                  Focus on measurable impact, strong action verbs, and
                  technologies relevant to your target role.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[4px] border border-hairline px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw size={16} />
                Analyze again
              </button>

            </div>
          </section>
        </>
      )}
    </div>
  );
}