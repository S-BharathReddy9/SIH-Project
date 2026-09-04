"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PatientIntakeState } from "@/types/intake";
import { DoctorHeader } from "@/components/doctor/DoctorHeader";
import { DoctorLoginGate } from "@/components/doctor/DoctorLoginGate";
import { useDoctorAuth } from "@/components/doctor/DoctorAuthContext";
import {
  getPatientQueue,
  resetToDemoDefaults,
  saveActiveSession,
  reassignPatientDoctor,
  getDoctorRoster,
  DoctorProfile
} from "@/lib/kioskStore";
import {
  User,
  ShieldCheck,
  AlertTriangle,
  Clock,
  FileText,
  Activity,
  CheckCircle,
  ChevronRight,
  Filter,
  Leaf,
  RotateCcw,
  Sparkles,
  UserCheck,
  ArrowRightLeft,
  HeartPulse,
  Lock
} from "lucide-react";

export default function DoctorQueuePage() {
  const { doctor: authDoctor } = useDoctorAuth();
  const [patients, setPatients] = useState<PatientIntakeState[]>([]);
  const [activeDoctor, setActiveDoctor] = useState<DoctorProfile | null>(null);
  const [viewFilter, setViewFilter] = useState<"MY_PATIENTS" | "ALL" | "EMERGENCY" | "AYUSH" | "HISTORY">("MY_PATIENTS");
  const [reassigningPatientId, setReassigningPatientId] = useState<string | null>(null);

  const loadData = () => {
    setPatients(getPatientQueue());
  };

  useEffect(() => {
    loadData();
    if (authDoctor) {
      setActiveDoctor(authDoctor);
    }
  }, [authDoctor]);

  const handleRefresh = () => {
    loadData();
  };

  const handleResetDemo = () => {
    const fresh = resetToDemoDefaults();
    setPatients(fresh);
  };

  const handleReassign = (patientId: string, targetDoctorId: string) => {
    reassignPatientDoctor(patientId, targetDoctorId);
    setReassigningPatientId(null);
    loadData();
  };

  // Filter patients based on assignment and tab selection
  const filteredPatients = patients.filter((p) => {
    if (viewFilter === "HISTORY") return p.patient.status === "DISCHARGED";
    if (p.patient.status === "DISCHARGED") return false;
    if (viewFilter === "MY_PATIENTS") {
      if (!activeDoctor) return true;
      return p.patient.assignedDoctorId === activeDoctor.id;
    }
    if (viewFilter === "EMERGENCY") return p.patient.triageCategory === "Emergency";
    if (viewFilter === "AYUSH") return p.isAyushMode;
    return true; // ALL
  });

  const myAssignedCount = activeDoctor
    ? patients.filter((p) => p.patient.status !== "DISCHARGED" && p.patient.assignedDoctorId === activeDoctor.id).length
    : patients.filter((p) => p.patient.status !== "DISCHARGED").length;
  const activePatients = patients.filter((p) => p.patient.status !== "DISCHARGED");
  const emergencyCount = activePatients.filter((p) => p.patient.triageCategory === "Emergency").length;
  const urgentCount = activePatients.filter((p) => p.patient.triageCategory === "Urgent").length;
  const routineCount = activePatients.filter((p) => p.patient.triageCategory === "Routine").length;
  const dischargedCount = patients.filter((p) => p.patient.status === "DISCHARGED").length;

  return (
    <DoctorLoginGate>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <DoctorHeader
          emergencyCount={emergencyCount}
          urgentCount={urgentCount}
          routineCount={routineCount}
          onRefresh={handleRefresh}
          onDoctorSwitched={(doc) => {
            setActiveDoctor(doc);
            loadData();
          }}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Active Doctor Welcome & Assignment Info Banner */}
          {activeDoctor && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${activeDoctor.avatarColor}`}
                >
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-black text-white">{activeDoctor.name}</h2>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 border border-slate-700">
                      {activeDoctor.regNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeDoctor.designation} • <strong>{activeDoctor.department}</strong> • {activeDoctor.opdRoom}
                  </p>
                </div>
              </div>

              {/* View Filter Tabs: Defaults to "Assigned to Me" */}
              <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs w-full md:w-auto overflow-x-auto">
                <button
                  onClick={() => setViewFilter("MY_PATIENTS")}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                    viewFilter === "MY_PATIENTS"
                      ? "bg-sky-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>Assigned to Me</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                    {myAssignedCount}
                  </span>
                </button>

                <button
                  onClick={() => setViewFilter("HISTORY")}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 ${
                    viewFilter === "HISTORY" ? "bg-emerald-700 text-white shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Patient History ({dischargedCount})
                </button>

                <button
                  onClick={() => setViewFilter("ALL")}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                    viewFilter === "ALL"
                      ? "bg-slate-800 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>All Hospital Patients</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-700 text-[10px]">
                    {patients.length}
                  </span>
                </button>

                <button
                  onClick={() => setViewFilter("EMERGENCY")}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 ${
                    viewFilter === "EMERGENCY"
                      ? "bg-rose-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Emergency ({emergencyCount})
                </button>

                <button
                  onClick={() => setViewFilter("AYUSH")}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 ${
                    viewFilter === "AYUSH"
                      ? "bg-emerald-700 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  AYUSH OPD
                </button>
              </div>
            </div>
          )}

          {/* Patients List */}
          <div className="space-y-3">
            {filteredPatients.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">No patients currently in your queue</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  There are no patients currently assigned to {activeDoctor?.name}. You can click "All Hospital Patients" above to view or accept patient referrals.
                </p>
                <button
                  onClick={() => setViewFilter("ALL")}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors inline-block"
                >
                  View All Hospital Intake Queue
                </button>
              </div>
            ) : (
              filteredPatients.map((patient) => {
                const isEmergency = patient.patient.triageCategory === "Emergency";
                const isAssignedToMe = activeDoctor && patient.patient.assignedDoctorId === activeDoctor.id;
                const abnormalLabs = patient.scannedDocuments.flatMap((d) =>
                  (d.extractedLabTests || []).filter((l: any) => l.abnormalFlag)
                );

                return (
                  <div
                    key={patient.patient.id}
                    className={`bg-slate-900 border rounded-3xl p-5 sm:p-6 transition-all hover:border-sky-500/50 shadow-md ${
                      isEmergency
                        ? "border-rose-500/60 bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900"
                        : isAssignedToMe
                        ? "border-slate-800 ring-1 ring-sky-500/20"
                        : "border-slate-800/80 opacity-90"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      {/* Left Bio & Token */}
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${
                            isEmergency
                              ? "bg-rose-600 text-white ring-4 ring-rose-900 animate-pulse"
                              : patient.isAyushMode
                              ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-sky-600/20 text-sky-400 border border-sky-500/30"
                          }`}
                        >
                          {patient.patient.opdToken}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <h3 className="text-lg font-black text-white">{patient.patient.name}</h3>
                            <span className="text-xs text-slate-400 font-medium">
                              {patient.patient.age}Y • {patient.patient.gender}
                            </span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                              patient.patient.status === "READY_FOR_DISCHARGE"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : "bg-sky-500/20 text-sky-300 border-sky-500/40"
                            }`}>
                              {(patient.patient.status || "WAITING").replaceAll("_", " ")}
                            </span>

                            {isAssignedToMe ? (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                Assigned to You
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                Assigned: {patient.patient.assignedDoctorName || "General OPD"}
                              </span>
                            )}

                            {isEmergency && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white">
                                CODE RED
                              </span>
                            )}

                            {patient.isAyushMode && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                                <Leaf className="w-3 h-3" />
                                <span>AYUSH</span>
                              </span>
                            )}

                            {patient.doctorConfirmed && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3 text-sky-400" />
                                <span>Doctor Signed</span>
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-400 flex items-center space-x-3 flex-wrap">
                            <span className="flex items-center space-x-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="font-mono text-slate-300">{patient.patient.abhaId}</span>
                            </span>
                            <span>•</span>
                            <span>
                              Room: <strong>{patient.patient.assignedRoom || "Room #4"}</strong>
                            </span>
                            <span>•</span>
                            <span>{patient.scannedDocuments.length} Scanned Records</span>
                            {patient.patient.status === "DISCHARGED" && patient.patient.dischargeTimestamp && (
                              <>
                                <span>•</span>
                                <span>Discharged {new Date(patient.patient.dischargeTimestamp).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Chief Complaints & OCR Abnormal Flags Preview */}
                      <div className="flex-1 lg:px-6 w-full lg:w-auto">
                        <div className="text-xs text-slate-300 font-semibold truncate max-w-md">
                          <strong className="text-slate-400 font-normal">Complaints: </strong>
                          {patient.chiefComplaints.map((c) => c.symptom).join(", ") || "General Checkup"}
                        </div>

                        {/* Abnormal Lab Badges */}
                        {abnormalLabs.length > 0 && (
                          <div className="flex items-center space-x-2 mt-2 flex-wrap">
                            <span className="text-[10px] text-rose-400 font-bold uppercase">OCR Anomalies:</span>
                            {abnormalLabs.map((lab: any, i: number) => (
                              <span
                                key={i}
                                className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40"
                              >
                                {lab.testName}: {lab.value} {lab.unit} [{lab.status}]
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Reassignment Controls & Open Consultation Button */}
                      <div className="w-full lg:w-auto flex flex-col sm:flex-row items-end sm:items-center gap-2">
                        {/* Reassign / Referral Dropdown */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setReassigningPatientId(
                                reassigningPatientId === patient.patient.id ? null : patient.patient.id
                              )
                            }
                            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                            title="Reassign or Refer Patient to another doctor"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5 text-sky-400" />
                            <span className="hidden sm:inline">Refer / Reassign</span>
                          </button>

                          {reassigningPatientId === patient.patient.id && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50">
                              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                                Reassign to Doctor:
                              </div>
                              <div className="space-y-1 mt-1">
                                {getDoctorRoster().map((doc) => (
                                  <button
                                    key={doc.id}
                                    type="button"
                                    onClick={() => handleReassign(patient.patient.id, doc.id)}
                                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between ${
                                      patient.patient.assignedDoctorId === doc.id
                                        ? "bg-slate-800 text-sky-400 font-bold"
                                        : "text-slate-300 hover:bg-slate-800"
                                    }`}
                                  >
                                    <div>
                                      <div className="font-bold">{doc.name}</div>
                                      <div className="text-[10px] text-slate-400">{doc.department}</div>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500">{doc.opdRoom}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Open Consultation Button */}
                        <Link
                          href={`/doctor/patient/${patient.patient.id}`}
                          onClick={() => saveActiveSession(patient)}
                          className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md ${
                            isEmergency
                              ? "bg-rose-600 hover:bg-rose-500 text-white"
                              : "bg-sky-600 hover:bg-sky-500 text-white"
                          }`}
                        >
                          <span>Open Consultation</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </DoctorLoginGate>
  );
}
