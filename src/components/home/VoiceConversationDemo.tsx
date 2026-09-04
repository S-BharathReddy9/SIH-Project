"use client";

import React, { useState } from "react";
import { ArrowRight, Bot, CheckCircle2, FileText, Mic, MicOff, RotateCcw, UserRound, Volume2 } from "lucide-react";
import { createSpeechRecognizer, speakText, stopSpeaking } from "@/lib/speechHelper";

type ConversationStep = {
  patient: string;
  ai: string;
};

const CONVERSATION: ConversationStep[] = [
  {
    patient: "I have stomach pain.",
    ai: "Since when are you having the pain?"
  },
  {
    patient: "From yesterday.",
    ai: "Is the pain continuous or does it come and go?"
  },
  {
    patient: "It comes and goes.",
    ai: "Thank you. I will ask a few more questions to understand your symptoms."
  }
];

export const VoiceConversationDemo: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const currentStep = CONVERSATION[stepIndex];

  const resetDemo = () => {
    stopSpeaking();
    setStepIndex(0);
    setTranscript("");
    setIsListening(false);
    setShowSummary(false);
  };

  const advanceConversation = (spokenText: string) => {
    setTranscript(spokenText);
    setIsListening(false);
    if (stepIndex < CONVERSATION.length - 1) {
      setStepIndex((current) => current + 1);
    }
  };

  const startListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognizer = createSpeechRecognizer(
      "en",
      (text) => advanceConversation(text),
      () => setIsListening(false),
      () => setIsListening(false)
    );

    if (!recognizer) {
      setIsListening(true);
      window.setTimeout(() => {
        advanceConversation(currentStep.patient);
      }, 1200);
      return;
    }

    stopSpeaking();
    recognizer.start();
    setIsListening(true);
  };

  const playAiPrompt = () => {
    speakText(currentStep.ai, "en");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-[2rem] border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6 sm:p-9 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-indigo-800">
              <Bot className="w-4 h-4" />
              AI voice conversation
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              No long forms. Just speak naturally.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Patient speaks → AI understands → AI asks the next relevant question. The conversation adapts to the
              patient&apos;s answers and creates structured clinical history for the doctor.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-700">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">1</span>
              Speak in your own words
              <ArrowRight className="w-4 h-4" />
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white">2</span>
              Get guided questions
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <UserRound className="w-5 h-5" />
                </div>
                <div className="rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3 text-sm text-slate-800">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Patient</p>
                  <p className="mt-1 font-semibold">{currentStep.patient}</p>
                </div>
              </div>

              <div className="flex items-start justify-end gap-3">
                <div className="rounded-2xl rounded-tr-md bg-indigo-600 px-4 py-3 text-sm text-white">
                  <p className="text-[10px] font-black uppercase tracking-wider text-indigo-200">MediKiosk AI</p>
                  <p className="mt-1 font-semibold">{currentStep.ai}</p>
                </div>
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Bot className="w-5 h-5" />
                </div>
              </div>

              {transcript && (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                  Heard: <span className="font-semibold">&quot;{transcript}&quot;</span>
                </p>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={startListening}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow transition-all ${
                  isListening ? "bg-rose-600 ring-4 ring-rose-100" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {isListening ? "Listening..." : "Answer with voice"}
              </button>
              <button
                type="button"
                onClick={playAiPrompt}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <Volume2 className="w-5 h-5 text-indigo-600" />
                Hear AI question
              </button>
              <button
                type="button"
                onClick={resetDemo}
                className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50"
                aria-label="Restart voice conversation demo"
              >
                <RotateCcw className="w-4 h-4" />
                Restart
              </button>
            </div>
            {stepIndex === CONVERSATION.length - 1 && (
              <button
                type="button"
                onClick={() => setShowSummary(true)}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow hover:bg-emerald-700"
              >
                <FileText className="w-5 h-5" />
                Generate physician-ready summary
              </button>
            )}
            <p className="mt-3 text-[11px] text-slate-500">
              Demo step {stepIndex + 1} of {CONVERSATION.length}. Microphone access is only used when you choose to speak.
            </p>
          </div>
        </div>

        {showSummary && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6 rounded-3xl border border-emerald-200 bg-white p-5 sm:p-7 shadow-lg">
            <div>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
                <p className="text-xs font-black uppercase tracking-wider">Interview processed</p>
              </div>
              <h3 className="mt-2 text-2xl font-black text-slate-900">Raw conversation → AI → structured history</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                MediKiosk extracts clinically relevant details from the patient&apos;s answers and organizes them into a
                physician-ready format. The doctor remains in control to review and edit the summary.
              </p>
              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Raw conversation</p>
                <div className="mt-3 space-y-2 text-xs text-slate-700">
                  {CONVERSATION.map((turn) => (
                    <p key={`${turn.patient}-${turn.ai}`}>
                      <span className="font-bold text-slate-900">Patient:</span> &quot;{turn.patient}&quot;
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-wider text-indigo-700">AI structured clinical history</p>
                <span className="rounded-full bg-indigo-100 px-2 py-1 text-[10px] font-bold text-indigo-700">Draft for review</span>
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <div><dt className="font-black text-slate-900">CHIEF COMPLAINT</dt><dd className="text-slate-700">Abdominal pain for 2 days.</dd></div>
                <div><dt className="font-black text-slate-900">HISTORY OF PRESENT ILLNESS</dt><dd className="text-slate-700">Intermittent abdominal pain, with symptoms beginning yesterday.</dd></div>
                <div><dt className="font-black text-slate-900">PAST HISTORY</dt><dd className="text-slate-700">To be confirmed during the complete interview.</dd></div>
                <div><dt className="font-black text-slate-900">MEDICATIONS</dt><dd className="text-slate-700">To be confirmed during the complete interview.</dd></div>
                <div><dt className="font-black text-slate-900">ALLERGIES</dt><dd className="text-slate-700">Not reported.</dd></div>
                <div><dt className="font-black text-slate-900">FAMILY / PERSONAL HISTORY</dt><dd className="text-slate-700">To be confirmed during the complete interview.</dd></div>
                <div><dt className="font-black text-slate-900">PREVIOUS INVESTIGATIONS</dt><dd className="text-slate-700">No investigations reported.</dd></div>
              </dl>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
