"use client";

import React, { useState } from "react";
import { CheckCircle2, ChevronDown, GitBranch, Sparkles } from "lucide-react";

type QuestionPath = {
  complaint: string;
  color: string;
  questions: string[];
};

const QUESTION_PATHS: QuestionPath[] = [
  {
    complaint: "Headache",
    color: "indigo",
    questions: ["When did it start?", "How severe is it?", "Is it continuous or intermittent?", "Do you have fever?", "Any vomiting?", "Previous migraine?"]
  },
  {
    complaint: "Skin problem",
    color: "emerald",
    questions: ["Where is the rash or lesion?", "When did it first appear?", "Is it itchy, painful, or spreading?", "Any new food, medicine, or product?", "Any fever or swelling?", "Previous skin condition?"]
  },
  {
    complaint: "Stomach pain",
    color: "amber",
    questions: ["Where exactly is the pain?", "When did it start?", "Is it related to meals?", "Any vomiting or loose stools?", "Any fever or blood in stool?", "Previous acidity or surgery?"]
  }
];

export const AdaptiveQuestionsDemo: React.FC = () => {
  const [selectedComplaint, setSelectedComplaint] = useState(QUESTION_PATHS[0]);
  const [visibleQuestions, setVisibleQuestions] = useState(3);

  const selectComplaint = (path: QuestionPath) => {
    setSelectedComplaint(path);
    setVisibleQuestions(3);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-[2rem] border border-teal-200 bg-white p-6 sm:p-9 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-teal-800">
              <GitBranch className="w-4 h-4" />
              Smart adaptive questions
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Every patient follows the right clinical path
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
              MediKiosk does not ask every patient the same 50 questions. It detects the chief complaint and previous
              answers, then selects the next clinically relevant question.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white">
            <Sparkles className="w-4 h-4 text-amber-300" />
            AI-assisted history-taking
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-6">
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Patient complaint</p>
            <div className="mt-3 space-y-2">
              {QUESTION_PATHS.map((path) => {
                const active = selectedComplaint.complaint === path.complaint;
                return (
                  <button
                    key={path.complaint}
                    type="button"
                    onClick={() => selectComplaint(path)}
                    className={`w-full rounded-2xl border-2 px-4 py-3 text-left text-sm font-bold transition-all ${
                      active
                        ? "border-teal-600 bg-teal-50 text-teal-900 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-teal-300"
                    }`}
                  >
                    {active && <CheckCircle2 className="mr-2 inline-block h-4 w-4 text-teal-600" />}
                    {path.complaint}
                  </button>
                );
              })}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-slate-500">
              Select a different complaint to see the question path change instead of repeating a fixed form.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-white">Complaint</span>
              <span>↓</span>
              <span className="rounded-full bg-teal-100 px-3 py-1 text-teal-800">{selectedComplaint.complaint} detected</span>
              <span>↓</span>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-800">Adaptive path</span>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedComplaint.questions.slice(0, visibleQuestions).map((question, index) => (
                <div key={question} className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-600">Question {index + 1}</span>
                  <p className="mt-1 text-sm font-bold text-slate-800">{question}</p>
                  {index < visibleQuestions - 1 && index < selectedComplaint.questions.length - 1 && (
                    <span className="absolute -bottom-3 left-1/2 z-10 hidden -translate-x-1/2 text-slate-400 sm:block">↓</span>
                  )}
                </div>
              ))}
            </div>
            {visibleQuestions < selectedComplaint.questions.length ? (
              <button
                type="button"
                onClick={() => setVisibleQuestions((count) => Math.min(count + 1, selectedComplaint.questions.length))}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow hover:bg-teal-700"
              >
                Ask next relevant question
                <ChevronDown className="w-4 h-4" />
              </button>
            ) : (
              <p className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                Path complete — answers are ready for the clinical summary
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
