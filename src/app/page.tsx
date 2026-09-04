"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  Stethoscope,
  ShieldCheck,
  Languages,
  FileText,
  HeartPulse,
  Leaf,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  ChevronRight,
  PlayCircle
} from "lucide-react";
import { SAMPLE_PATIENTS } from "@/data/samplePatients";
import { saveActiveSession, upsertPatientToQueue } from "@/lib/kioskStore";
import { VoiceConversationDemo } from "@/components/home/VoiceConversationDemo";
import { AdaptiveQuestionsDemo } from "@/components/home/AdaptiveQuestionsDemo";

export default function HomePage() {
  const router = useRouter();

  const handleLaunchCase = (patient: (typeof SAMPLE_PATIENTS)[0]) => {
    saveActiveSession(patient);
    upsertPatientToQueue(patient);
    router.push(`/doctor/patient/${patient.patient.id}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/30 to-slate-100">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900">MediKiosk</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  ABDM First-Mile
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  AYUSH Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                AI-Powered Digital Clinical Intake & Triage System for Indian Hospitals
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/doctor"
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow"
            >
              Doctor's Desk View
            </Link>
            <Link
              href="/kiosk"
              className="text-xs font-bold px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md"
            >
              Launch Kiosk
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-900 text-xs font-bold mb-4 border border-sky-200">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span>Solving the OPD Rush & First-Mile Clinical Intake in Indian Hospitals</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          AI-Powered Digital Clinical Intake & Triage for{" "}
          <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Modern & AYUSH Hospitals
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto font-medium">
          In high-volume OPDs with thousands of daily patients and only 2–5 minutes per consultation,
          MediKiosk captures structured clinical history in the patient's native language, scans and digitizes old reports,
          flags critical abnormal values, and delivers a 60-second summary to the doctor before consultation.
        </p>

        {/* Primary Role Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-10 text-left">
          {/* Patient Kiosk Card */}
          <Link
            href="/kiosk"
            className="p-8 rounded-3xl bg-white border-2 border-sky-200 hover:border-sky-500 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8" />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Patient Interface</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Voice + Touch
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mt-1">Patient Check-In Kiosk</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Multilingual self-service kiosk with audio guidance, SOCRATES pain inquiry, AYUSH Dashavidha Pariksha, and document scanner for handwritten prescriptions and lab reports.
            </p>

            <div className="mt-6 flex items-center text-sm font-bold text-sky-600 group-hover:text-sky-700">
              <span>Start Patient Intake Experience</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Doctor Desk Card */}
          <Link
            href="/doctor"
            className="p-8 rounded-3xl bg-slate-900 text-white border-2 border-slate-800 hover:border-sky-400 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-8 h-8" />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Doctor Interface</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/30 text-rose-300">
                Live OPD Queue
              </span>
            </div>

            <h3 className="text-2xl font-black text-white mt-1">Doctor's Consultation Desk</h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              60-second structured intake digest, red-flag emergency alerts, OCR extracted lab timelines with abnormal highlights, full doctor edit/approval controls, and ABDM FHIR export.
            </p>

            <div className="mt-6 flex items-center text-sm font-bold text-sky-400 group-hover:text-sky-300">
              <span>Open Doctor OPD Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Problem, Context & Solution Structure */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-700">Clinical Context</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            The problem is not just registration — it is the first-mile clinical intake gap
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">Problem 01</span>
            </div>
            <h3 className="mt-4 text-xl font-black text-slate-900">Overburdened OPDs</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              In Indian hospitals, doctors may have only 2–5 minutes per patient. In that time, they must collect history,
              examine, review reports, diagnose, and counsel — leaving critical symptoms and comorbidities under-elicited.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Problem 02</span>
            </div>
            <h3 className="mt-4 text-xl font-black text-slate-900">AYUSH complexity</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Ayurveda and AYUSH care require deeper assessment through Prakriti, Vikriti, Agni, Koshtha, Nidana,
              and Dashavidha Pariksha. Manual intake is often compressed or skipped under daily OPD pressure.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-700">Problem 03</span>
            </div>
            <h3 className="mt-4 text-xl font-black text-slate-900">Fragmented records</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Patients arrive with handwritten prescriptions, printed lab reports, scans, and discharge summaries in multiple
              languages and inconsistent order. The doctor wastes valuable consultation time reorganizing this information.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-slate-900 p-7 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">Why existing systems fail</p>
              <h3 className="mt-2 text-2xl font-black">Registration alone is not clinical intake</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-400" /> Traditional hospital kiosks capture name, age, and token only.</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-400" /> Mobile apps demand smartphone literacy, prior registration, and stable internet access.</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-400" /> Manual nurse desks cannot scale to high-volume daily OPD traffic.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">ABDM first-mile gap</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-200">
                India has ABHA, health information exchange, and FHIR standards, but there is still no patient-facing system that
                captures comprehensive history and digitizes documents before consultation begins.
              </p>
            </div>
          </div>
        </div>
      </div>

      <VoiceConversationDemo />
      <AdaptiveQuestionsDemo />

      {/* Flagship Test Cases Section for Hackathon Jury */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <PlayCircle className="w-5 h-5 text-sky-600" />
                <h3 className="text-xl font-black text-slate-900">
                  Interactive Live Clinical Demonstration Cases
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any pre-configured Indian clinical scenario to immediately inspect its clinical summary and ABDM bundle:
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              3 Representative Scenarios
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            {/* Case 1: Ramesh Kumar */}
            <div className="p-5 rounded-2xl bg-rose-50/60 border-2 border-rose-200 flex flex-col justify-between hover:border-rose-400 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black px-2 py-0.5 rounded bg-rose-600 text-white">
                    EMERGENCY TRIAGE
                  </span>
                  <span className="text-xs font-bold text-slate-500">Token E-01</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mt-2">Ramesh Kumar (54M)</h4>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  <strong>Chief Complaint:</strong> Crushing chest pain radiating to left arm + diaphoresis.
                </p>
                <div className="mt-3 text-[11px] text-rose-900 font-semibold bg-white p-2.5 rounded-xl border border-rose-200">
                  🚨 <strong>Triggered:</strong> Acute Coronary Syndrome (STEMI) Red Flag with instant resuscitation bay transfer alert.
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunchCase(SAMPLE_PATIENTS[0])}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>View Emergency Case in Desk</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Case 2: Sunita Devi */}
            <div className="p-5 rounded-2xl bg-sky-50/60 border-2 border-sky-200 flex flex-col justify-between hover:border-sky-400 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black px-2 py-0.5 rounded bg-sky-600 text-white">
                    DOCUMENT OCR & ANOMALY
                  </span>
                  <span className="text-xs font-bold text-slate-500">Token GEN-042</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mt-2">Sunita Devi (48F)</h4>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  <strong>Chief Complaint:</strong> Chronic fatigue x 2 months, polyuria, burning feet soles.
                </p>
                <div className="mt-3 text-[11px] text-sky-900 font-semibold bg-white p-2.5 rounded-xl border border-sky-200">
                  🔬 <strong>AI OCR Digitize:</strong> 3 old reports parsed; flags Hb = 8.2 g/dL [Severely Low] and FBS = 215 mg/dL [High].
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunchCase(SAMPLE_PATIENTS[1])}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>View OCR Anomaly Case</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Case 3: Rajeshwari Sharma */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border-2 border-emerald-200 flex flex-col justify-between hover:border-emerald-400 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black px-2 py-0.5 rounded bg-emerald-700 text-white">
                    AYUSH DASHAVIDHA
                  </span>
                  <span className="text-xs font-bold text-slate-500">Token AYUSH-14</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mt-2">Rajeshwari Sharma (42F)</h4>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  <strong>Chief Complaint:</strong> Chronic joint pain & morning stiffness x 6 months (Amavata).
                </p>
                <div className="mt-3 text-[11px] text-emerald-900 font-semibold bg-white p-2.5 rounded-xl border border-emerald-200">
                  🌿 <strong>AYUSH Pariksha:</strong> Vata-Kapha Prakriti, Manda Agni, Krura Koshtha, and Viruddha Ahara Nidana.
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunchCase(SAMPLE_PATIENTS[2])}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>View AYUSH Pariksha Case</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Modules Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Architecture & Capabilities
        </h2>
        <h3 className="text-center text-2xl sm:text-3xl font-black text-slate-900 mb-10">
          The 4 Pillars of MediKiosk
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <Languages className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Module A: Conversational History</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Adaptive questioning (SOCRATES pain framework), dual-mode voice + touchscreen in 6 Indian languages, and real-time emergency red-flag detection.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Module B: Document Digitization</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              OCR for handwritten prescriptions and lab reports, entity extraction of dosages and test values, chronological health timeline, and abnormal value flags.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Leaf className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Module C: Structured Summary</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              60-second doctor digest (CC, HPI, PMHx, Meds, Labs, AYUSH Dashavidha Pariksha). Doctor remains 100% in control to edit, confirm, or reject.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Module D: ABDM & DPDP Consent</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              14-digit ABHA validation, DPDP Act 2023 audio-visual consent with session purge, and full HL7 FHIR R4 Bundle generation for health information exchange.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
