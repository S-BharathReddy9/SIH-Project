"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PatientIntakeState } from "@/types/intake";
import { DoctorHeader } from "@/components/doctor/DoctorHeader";
import { DoctorLoginGate } from "@/components/doctor/DoctorLoginGate";
import { ClinicalSummaryView } from "@/components/doctor/ClinicalSummaryView";
import { getPatientQueue, upsertPatientToQueue, updatePatientStatus } from "@/lib/kioskStore";
import { SAMPLE_PATIENTS } from "@/data/samplePatients";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ClipboardCheck, ShieldCheck } from "lucide-react";

export default function DoctorPatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<PatientIntakeState | null>(null);
  const [staffCode, setStaffCode] = useState("");
  const [staffError, setStaffError] = useState("");

  useEffect(() => {
    const queue = getPatientQueue();
    let found = queue.find((p) => p.patient.id === patientId);
    if (!found) {
      found = SAMPLE_PATIENTS.find((p) => p.patient.id === patientId);
    }
    if (found) {
      setPatient(found);
    }
  }, [patientId]);

  const handleSaveNotes = (notes: string, confirmed: boolean) => {
    if (!patient) return;
    const updated: PatientIntakeState = {
      ...patient,
      doctorReviewNotes: notes,
      doctorConfirmed: confirmed
    };
    setPatient(updated);
    upsertPatientToQueue(updated);
  };

  const handleInitiateDischarge = () => {
    if (!patient) return;
    const updated = updatePatientStatus(patient.patient.id, "READY_FOR_DISCHARGE");
    if (updated) setPatient(updated);
  };

  const handleCompleteDischarge = () => {
    if (!patient) return;
    if (staffCode.trim() !== "2468") {
      setStaffError("Staff verification failed. Demo nurse/staff code is 2468.");
      return;
    }
    const updated = updatePatientStatus(patient.patient.id, "DISCHARGED", {
      dischargeSummary: "Treatment completed. Discharge instructions reviewed by nurse/staff."
    });
    if (updated) {
      setPatient(updated);
      setStaffError("");
    }
  };

  if (!patient) {
    return (
      <DoctorLoginGate>
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-4 max-w-md">
            <p className="text-slate-300">Patient record not found or session expired.</p>
            <Link
              href="/doctor"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to OPD Queue</span>
            </Link>
          </div>
        </div>
      </DoctorLoginGate>
    );
  }

  return (
    <DoctorLoginGate>
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <DoctorHeader
          emergencyCount={0}
          urgentCount={0}
          routineCount={0}
          showBackToQueue={true}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <ClinicalSummaryView
            intake={patient}
            onSaveNotes={handleSaveNotes}
          />
          <div className="max-w-6xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">Patient status workflow</p>
                <h3 className="mt-1 text-xl font-black text-slate-900">
                  {(patient.patient.status || "WAITING").replaceAll("_", " ")}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Doctor initiates discharge; nurse/staff verifies completion. Medical records remain available in history.
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${
                patient.patient.status === "DISCHARGED"
                  ? "bg-emerald-100 text-emerald-800"
                  : patient.patient.status === "READY_FOR_DISCHARGE"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-sky-100 text-sky-800"
              }`}>
                {patient.patient.status || "WAITING"}
              </span>
            </div>

            {patient.patient.status !== "DISCHARGED" && patient.patient.status !== "READY_FOR_DISCHARGE" && (
              <button
                type="button"
                onClick={handleInitiateDischarge}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white hover:bg-amber-700"
              >
                <ClipboardCheck className="w-5 h-5" />
                Initiate Discharge
              </button>
            )}

            {patient.patient.status === "READY_FOR_DISCHARGE" && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-bold text-amber-950">Discharge initiated by doctor</p>
                <p className="mt-1 text-xs text-amber-800">Nurse/Staff must verify medications and instructions before completion.</p>
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <input
                    value={staffCode}
                    onChange={(event) => setStaffCode(event.target.value)}
                    placeholder="Nurse/Staff verification code"
                    className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm"
                    aria-label="Nurse or staff verification code"
                  />
                  <button
                    type="button"
                    onClick={handleCompleteDischarge}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Verify & Complete Discharge
                  </button>
                </div>
                {staffError && <p className="mt-2 text-xs font-bold text-rose-700">{staffError}</p>}
              </div>
            )}

            {patient.patient.status === "DISCHARGED" && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <div className="flex items-center gap-2 font-bold"><CheckCircle2 className="w-5 h-5" /> Discharge completed</div>
                <p className="mt-1 text-xs">This patient is removed from Active Patients and retained in Patient History.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </DoctorLoginGate>
  );
}
