"use client";

import React from "react";
import Link from "next/link";
import { LanguageCode } from "@/types/intake";
import { TRANSLATIONS } from "@/lib/translations";
import { Activity, Globe, ShieldCheck, Home } from "lucide-react";

interface KioskHeaderProps {
  currentStep: number;
  language: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export const KioskHeader: React.FC<KioskHeaderProps> = ({
  currentStep,
  language,
  onLanguageChange
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const steps = [
    { num: 1, title: "Identity & Consent" },
    { num: 2, title: "Clinical History" },
    { num: 3, title: "Scan Documents" },
    { num: 4, title: "Triage & Token" }
  ];

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: "en", label: "English", native: "English" },
    { code: "hi", label: "Hindi", native: "हिंदी" },
    { code: "ta", label: "Tamil", native: "தமிழ்" },
    { code: "te", label: "Telugu", native: "తెలుగు" },
    { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
    { code: "bn", label: "Bengali", native: "বাংলা" }
  ];

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Hospital & App Brand */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900">MediKiosk</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  ABDM Enabled
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  AYUSH Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">District Hospital & AYUSH OPD Self-Intake Desk</p>
            </div>
          </Link>
        </div>

        {/* Language & Patient Privacy Indicator */}
        <div className="flex items-center space-x-3">
          {/* Privacy Badge */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>DPDP 2023 Patient Privacy Guard</span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Globe className="w-4 h-4 text-slate-500 ml-2" />
            <select
              value={language}
              onChange={(e) => onLanguageChange && onLanguageChange(e.target.value as LanguageCode)}
              className="bg-transparent text-sm font-semibold text-slate-700 py-1 px-2 focus:outline-none cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native} ({l.label})
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Home / Role Switcher"
          >
            <Home className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Progress Steps Bar */}
      {currentStep > 0 && currentStep <= 4 && (
        <div className="bg-slate-50 border-t border-slate-200/80 px-4 py-2.5">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {steps.map((s, idx) => {
              const isCompleted = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <div key={s.num} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                          ? "bg-sky-600 text-white ring-4 ring-sky-100"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isCompleted ? "✓" : s.num}
                    </div>
                    <span
                      className={`text-xs font-semibold hidden md:inline ${
                        isCurrent ? "text-sky-900 font-bold" : isCompleted ? "text-emerald-800" : "text-slate-400"
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-3 rounded transition-colors ${
                        isCompleted ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
