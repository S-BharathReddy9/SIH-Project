"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PatientIntakeState, LanguageCode } from "@/types/intake";
import { TRANSLATIONS } from "@/lib/translations";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { getActiveSession, clearActiveSession } from "@/lib/kioskStore";
import { speakText, stopSpeaking } from "@/lib/speechHelper";
import {
  CheckCircle2,
  Printer,
  QrCode,
  ShieldCheck,
  Stethoscope,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Lock
} from "lucide-react";

export default function KioskSummaryPage() {
  const router = useRouter();
  const [session, setSession] = useState<PatientIntakeState | null>(null);

  useEffect(() => {
    const active = getActiveSession();
    if (active) {
      setSession(active);
      const isHi = active.patient.language === "hi";
      const congratsText = isHi
        ? `धन्यवाद ${active.patient.name} जी! आपका स्वास्थ्य विवरण दर्ज हो चुका है। आपका ओपीडी टोकन नंबर ${active.patient.opdToken} है। कृपया कमरा नंबर 4 में पधारें।`
        : `Thank you ${active.patient.name}! Your clinical intake is complete. Your OPD Token is ${active.patient.opdToken}. Please proceed to Room #4.`;
      speakText(congratsText, active.patient.language);
    }
  }, []);

  const handleFinishAndClear = () => {
    stopSpeaking();
    // Purge temporary session data from this public kiosk terminal per DPDP Act 2023
    clearActiveSession();
    router.push("/kiosk");
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-3xl text-center space-y-3 shadow-md max-w-sm">
          <p className="text-slate-600 text-sm font-medium">Session has ended or expired.</p>
          <button
            onClick={() => router.push("/kiosk")}
            className="inline-block px-4 py-2 bg-sky-600 text-white rounded-xl font-bold text-xs"
          >
            Start New Patient Check-in
          </button>
        </div>
      </div>
    );
  }

  const isEmergency = session.patient.triageCategory === "Emergency";
  const language = session.patient.language || "hi";
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isHi = language === "hi";

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <KioskHeader currentStep={4} language={language} />

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Success Banner */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {t.summaryTitle}
          </h2>
          <p className="text-sm text-slate-600">
            {isHi
              ? "आपका स्वास्थ्य विवरण सुरक्षित रूप से डॉक्टर के कंप्यूटर पर भेज दिया गया है।"
              : "Your clinical history has been securely encrypted and delivered to your consulting doctor."}
          </p>
        </div>

        {/* Printable OPD Token Slip */}
        <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-dashed border-slate-300">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                District Civil Hospital / AYUSH OPD
              </span>
              <h3 className="text-lg font-black text-slate-900">MediKiosk Clinical Intake Slip</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">{new Date().toLocaleDateString()}</span>
              <span className="text-xs font-bold text-sky-700 font-mono">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>

          {/* Big Token Number Display */}
          <div className="py-6 text-center border-b border-dashed border-slate-300 bg-slate-50/70 rounded-2xl my-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block">
              {t.opdTokenAssigned}
            </span>
            <div
              className={`text-4xl sm:text-6xl font-black tracking-tight mt-1 ${
                isEmergency ? "text-rose-600 animate-pulse" : "text-sky-700"
              }`}
            >
              {session.patient.opdToken}
            </div>
            <div className="mt-2 flex items-center justify-center space-x-2">
              <span
                className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                  isEmergency ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {isEmergency ? "Priority Triage: Resuscitation Bay #1" : "Triage Category: Routine Consultation"}
              </span>
            </div>
          </div>

          {/* Patient Details Table */}
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 py-2">
            <div>
              <span className="text-slate-400 block font-medium">Patient Name:</span>
              <span className="font-bold text-sm text-slate-900">{session.patient.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Age & Gender:</span>
              <span className="font-bold text-sm text-slate-900">
                {session.patient.age} Y • {session.patient.gender}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">ABHA Address:</span>
              <span className="font-bold text-slate-900 font-mono">
                {session.patient.abhaId || "ABHA-PENDING"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Department / Room:</span>
              <span className="font-bold text-sky-800">
                {session.isAyushMode ? "Dept of Kayachikitsa / AYUSH Room #2" : "General Medicine Room #4"}
              </span>
            </div>
          </div>

          {/* QR Code & Doctor Scan Instructions */}
          <div className="mt-5 pt-4 border-t border-dashed border-slate-300 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>Please wait in OPD Waiting Lounge C</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Show this slip or QR code to the nursing staff when your token is announced.
              </p>
            </div>

            <div className="w-20 h-20 bg-slate-900 rounded-xl p-2 flex items-center justify-center text-white shrink-0">
              <QrCode className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* DPDP Act 2023 Terminal Security Notice */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3 text-emerald-900 text-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>Patient Data Privacy Guard (DPDP Act 2023):</strong> Your personal health details have been encrypted and locked. Other patients using this kiosk terminal cannot view your data.
          </span>
        </div>

        {/* Action Controls for Patient */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center justify-center space-x-2 py-4 px-4 rounded-2xl font-bold text-sm bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{isHi ? "टोकन पर्ची प्रिंट करें" : "Print OPD Token Slip"}</span>
          </button>

          {/* Clean Session & Reset for Next Patient */}
          <button
            type="button"
            onClick={handleFinishAndClear}
            className="flex items-center justify-center space-x-2 py-4 px-6 rounded-2xl font-black text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all transform active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isHi ? "सत्र समाप्त करें (अगले मरीज के लिए)" : "Done: Clear Terminal for Next Patient"}</span>
          </button>
        </div>

        {/* Authorized Doctor / Staff Login Gate Link */}
        <div className="text-center pt-3 border-t border-slate-200">
          <Link
            href="/doctor"
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-700 font-semibold transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Authorized Doctor / Hospital Staff Login (Protected)</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
