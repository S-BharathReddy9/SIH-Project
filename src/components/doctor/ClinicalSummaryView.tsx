"use client";

import React, { useState, useEffect } from "react";
import { PatientIntakeState } from "@/types/intake";
import { generateAbdmFhirBundle } from "@/lib/fhirBuilder";
import { FhirExportModal } from "./FhirExportModal";
import {
  getCurrentDoctor,
  getDoctorRoster,
  reassignPatientDoctor,
  DoctorProfile
} from "@/lib/kioskStore";
import {
  User,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Pill,
  Activity,
  FileText,
  CheckCircle,
  XCircle,
  Printer,
  Download,
  Leaf,
  Heart,
  Edit3,
  Check,
  Share2,
  ArrowRightLeft,
  UserCheck
} from "lucide-react";

interface ClinicalSummaryViewProps {
  intake: PatientIntakeState;
  onSaveNotes: (notes: string, confirmed: boolean) => void;
}

export const ClinicalSummaryView: React.FC<ClinicalSummaryViewProps> = ({
  intake,
  onSaveNotes
}) => {
  const [activeDoctor, setActiveDoctor] = useState<DoctorProfile | null>(null);
  const [assignedDoctorName, setAssignedDoctorName] = useState(
    intake.patient.assignedDoctorName || "Dr. A. K. Sharma"
  );
  const [assignedRoom, setAssignedRoom] = useState(
    intake.patient.assignedRoom || "Room #4"
  );
  const [showReassignMenu, setShowReassignMenu] = useState(false);

  useEffect(() => {
    setActiveDoctor(getCurrentDoctor());
  }, []);

  const [doctorNotes, setDoctorNotes] = useState(
    intake.doctorReviewNotes ||
      (intake.redFlagAlert?.triggered
        ? `[EMERGENCY ACS PROTOCOL INITIATED] Stat 12-lead ECG and bedside Troponin-I ordered. Aspirin 300mg chewed + Clopidogrel 300mg given. Patient transferred to ER Resuscitation Bay #1.`
        : intake.isAyushMode
        ? `[AYUSH KAYACHIKITSA] Provisional Diagnosis: Amavata (Vata-Kapha Prakriti with Agnimandya and Sama condition). Advised: Deepana-Pachana with Shunthi-Guduchi Kwatha, Valuka Sweda, Castor oil at bedtime.`
        : `[OPD CLINICAL IMPRESSION] Provisional Diagnosis: 1. Uncontrolled Type 2 Diabetes Mellitus with peripheral neuropathy. 2. Severe Iron Deficiency Anemia (Hb 8.2 g/dL). Advised: Glycemic optimization, Oral Iron (Ferrous Ascorbate), repeat CBC in 4 weeks.`)
  );
  const [isConfirmed, setIsConfirmed] = useState(intake.doctorConfirmed);
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
    const doctorStamp = activeDoctor ? `\n[Signed by ${activeDoctor.name}, Reg: ${activeDoctor.regNumber}, Dept: ${activeDoctor.department}]` : "";
    const updatedNotes = doctorNotes.includes("[Signed by") ? doctorNotes : `${doctorNotes} ${doctorStamp}`;
    setDoctorNotes(updatedNotes);
    onSaveNotes(updatedNotes, true);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReassign = (doc: DoctorProfile) => {
    reassignPatientDoctor(intake.patient.id, doc.id);
    setAssignedDoctorName(doc.name);
    setAssignedRoom(doc.opdRoom);
    setShowReassignMenu(false);
  };

  const allExtractedLabs = intake.scannedDocuments.flatMap((d) => d.extractedLabTests || []);
  const allExtractedMeds = intake.scannedDocuments.flatMap((d) => d.extractedMedications || []);

  const fhirBundle = generateAbdmFhirBundle({
    ...intake,
    doctorReviewNotes: doctorNotes,
    doctorConfirmed: isConfirmed
  });

  const isAssignedToActiveDoctor =
    activeDoctor && intake.patient.assignedDoctorId === activeDoctor.id;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* 1. Patient Master Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-2xl shrink-0">
              {intake.patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="text-2xl font-black text-slate-900">{intake.patient.name}</h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {intake.patient.age}Y • {intake.patient.gender}
                </span>

                {isAssignedToActiveDoctor ? (
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Assigned to You
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                    Assigned: {assignedDoctorName}
                  </span>
                )}

                {intake.patient.triageCategory === "Emergency" && (
                  <span className="text-xs font-black px-3 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                    CODE RED EMERGENCY
                  </span>
                )}
                {intake.isAyushMode && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>AYUSH OPD</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1.5 flex-wrap">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-700">ABHA:</span>{" "}
                  <span className="font-mono">{intake.patient.abhaId || "ABHA-PENDING"}</span>
                </span>
                <span>•</span>
                <span>
                  <strong>Token:</strong> {intake.patient.opdToken || "GEN-01"}
                </span>
                <span>•</span>
                <span>
                  <strong>Room:</strong> <span className="text-sky-800 font-bold">{assignedRoom}</span>
                </span>
                <span>•</span>
                <span>
                  <strong>Checked-in:</strong> {new Date(intake.patient.intakeTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Buttons & Referral Dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end flex-wrap gap-2">
            {/* Reassign / Referral button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowReassignMenu(!showReassignMenu)}
                className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200"
                title="Refer or Transfer Patient to another Doctor"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-sky-600" />
                <span>Refer Patient</span>
              </button>

              {showReassignMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn text-white">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    Transfer Care to Doctor:
                  </div>
                  <div className="space-y-1 mt-1">
                    {getDoctorRoster().map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => handleReassign(doc)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          doc.name === assignedDoctorName
                            ? "bg-sky-600/20 text-sky-300 font-bold border border-sky-500/30"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <div>
                          <div className="font-bold">{doc.name}</div>
                          <div className="text-[10px] text-slate-400">{doc.department}</div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{doc.opdRoom}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowFhirModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow"
            >
              <Share2 className="w-4 h-4 text-sky-400" />
              <span>ABDM FHIR Bundle</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Emergency Red Flag Banner (If Triggered) */}
      {intake.redFlagAlert?.triggered && (
        <div className="bg-rose-50 border-2 border-rose-400 rounded-3xl p-5 shadow-sm">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
            <div className="flex-1">
              <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-200/70 px-2 py-0.5 rounded">
                CRITICAL TRIAGE ALERT
              </span>
              <h3 className="text-base font-black text-rose-950 mt-1">{intake.redFlagAlert.title}</h3>
              <p className="text-xs text-rose-900 mt-1 font-medium">{intake.redFlagAlert.description}</p>
              <div className="mt-2.5 p-3 rounded-xl bg-white border border-rose-200 text-xs text-rose-950 font-semibold">
                <strong>Resuscitation Order:</strong> {intake.redFlagAlert.actionRequired}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. 60-Second Clinical Digest (Chief Complaints & SOCRATES) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Chief Complaints & HPI Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Activity className="w-5 h-5 text-sky-600" />
              <h3 className="font-bold text-slate-900 text-base">Chief Complaints & History of Present Illness (HPI)</h3>
            </div>

            {/* Complaints List */}
            <div className="space-y-2">
              {intake.chiefComplaints.map((cc) => (
                <div
                  key={cc.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{cc.symptom}</span>
                    <span className="text-xs text-slate-500 block">Duration: {cc.duration}</span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      cc.severity === "severe"
                        ? "bg-rose-100 text-rose-800"
                        : cc.severity === "moderate"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {cc.severity.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>

            {/* SOCRATES Structured Grid */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                SOCRATES Symptom Interrogation Breakdown:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-sky-900 block font-bold">Site & Location:</strong>
                  <span className="text-slate-700">{intake.socrates.site || "Localized"}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-sky-900 block font-bold">Onset & Time Course:</strong>
                  <span className="text-slate-700">
                    {intake.socrates.onset} • {intake.socrates.timeCourse}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-sky-900 block font-bold">Character & Severity:</strong>
                  <span className="text-slate-700">
                    {intake.socrates.character} (Score: <strong>{intake.socrates.severity}/10</strong>)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-sky-900 block font-bold">Radiation:</strong>
                  <span className="text-slate-700">{intake.socrates.radiation || "None"}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <strong className="text-sky-900 block font-bold">Associated Symptoms:</strong>
                  <span className="text-slate-700">
                    {intake.socrates.associatedSymptoms.length > 0
                      ? intake.socrates.associatedSymptoms.join(", ")
                      : "None reported"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Past History, Medications & Allergies */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">Past History, Active Medications & Allergies</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Past Medical History */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 uppercase tracking-wider block">Past Medical History</span>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  {intake.pastMedicalHistory.map((pm, i) => (
                    <li key={i}>{pm}</li>
                  ))}
                </ul>
              </div>

              {/* Past Surgical History */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 uppercase tracking-wider block">Surgical History</span>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  {intake.pastSurgicalHistory.map((ps, i) => (
                    <li key={i}>{ps}</li>
                  ))}
                </ul>
              </div>

              {/* Current Medications */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 sm:col-span-2">
                <span className="font-bold text-slate-900 uppercase tracking-wider block">
                  Current Medications ({intake.currentMedications.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {intake.currentMedications.map((med, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold text-xs"
                    >
                      {med}
                    </span>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-1 sm:col-span-2">
                <span className="font-bold text-rose-950 uppercase tracking-wider block">Documented Allergies</span>
                <div className="flex flex-wrap gap-1.5">
                  {intake.knownAllergies.map((allg, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 font-bold text-xs"
                    >
                      {allg}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AYUSH Assessment Card (If AYUSH Mode Enabled) */}
          {intake.isAyushMode && intake.ayushAssessment && (
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-emerald-200">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-emerald-950 text-base">AYUSH / Ayurvedic Dashavidha Pariksha Summary</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-emerald-200">
                  <span className="text-slate-500 font-semibold block">Primary Prakriti</span>
                  <span className="text-sm font-black text-emerald-900">
                    {intake.ayushAssessment.dashavidha.prakriti.primary}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-200">
                  <span className="text-slate-500 font-semibold block">Agni Status</span>
                  <span className="text-sm font-black text-amber-800">
                    {intake.ayushAssessment.dashavidha.aharaShakti.agni} Agni
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-200">
                  <span className="text-slate-500 font-semibold block">Koshtha Nature</span>
                  <span className="text-sm font-black text-sky-900">
                    {intake.ayushAssessment.koshtha} Koshtha
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-200">
                  <span className="text-slate-500 font-semibold block">Vikriti Imbalance</span>
                  <span className="text-sm font-black text-rose-800">
                    {intake.ayushAssessment.dashavidha.vikriti.aggravatedDosha}
                  </span>
                </div>
              </div>

              {/* Nidana Causative Factors */}
              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block mb-1.5">
                  Nidana Ahara-Vihara (Etiological Factors):
                </span>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {intake.ayushAssessment.nidana.map((n: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-medium">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Lab Trends & OCR Documents */}
        <div className="space-y-6">
          {/* Lab Investigations from Scanned Documents */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-sm">Extracted Lab Parameters</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Via AI OCR
              </span>
            </div>

            {allExtractedLabs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No previous lab documents scanned.</p>
            ) : (
              <div className="space-y-2.5">
                {allExtractedLabs.map((lab, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      lab.abnormalFlag
                        ? "bg-rose-50/70 border-rose-300"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{lab.testName}</span>
                      <span className="text-[11px] text-slate-500">Ref: {lab.referenceRange} {lab.unit}</span>
                    </div>

                    <div className="text-right">
                      <span className={`text-sm font-black ${lab.abnormalFlag ? "text-rose-700" : "text-slate-800"}`}>
                        {lab.value} <span className="text-[10px] font-normal">{lab.unit}</span>
                      </span>
                      {lab.abnormalFlag && (
                        <span className="block text-[9px] font-bold text-rose-600 uppercase">
                          [{lab.status}]
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scanned Documents Timeline */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Scanned Paper Records ({intake.scannedDocuments.length})
            </h4>
            {intake.scannedDocuments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No paper records uploaded.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {intake.scannedDocuments.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{doc.title}</span>
                      <span className="text-[10px] text-sky-700 font-semibold">{doc.date}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">{doc.facilityOrDoctor}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. DOCTOR REVIEW & CONFIRMATION BOX (Doctor-In-The-Loop) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="font-black text-base text-white">
                Doctor Review, Differential Diagnosis & Clinical Notes
              </h3>
              <p className="text-xs text-slate-400">
                Consulting Physician: <strong>{activeDoctor?.name || assignedDoctorName}</strong> ({activeDoctor?.department || "General Medicine"})
              </p>
            </div>
          </div>

          {isConfirmed ? (
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Confirmed by {activeDoctor?.name || assignedDoctorName}</span>
            </span>
          ) : (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Pending Doctor Sign-off
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Clinical Notes & Final Prescription Advice:
          </label>
          <textarea
            rows={4}
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
            placeholder="Enter clinical assessment, differential diagnosis, laboratory orders, or prescription instructions..."
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DPDP Act 2023 Compliant • Medical Officer Verified</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleConfirm}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition-all transform active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{isConfirmed ? "Update Signed Assessment" : `Sign-off as ${activeDoctor?.name?.split(" ")[1] || "Doctor"}`}</span>
            </button>

            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-400 animate-pulse">
                ✓ Recorded to HIS & ABDM!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* FHIR R4 Bundle Modal */}
      {showFhirModal && (
        <FhirExportModal bundle={fhirBundle} onClose={() => setShowFhirModal(false)} />
      )}
    </div>
  );
};
