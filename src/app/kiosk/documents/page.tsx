"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LanguageCode, PatientIntakeState } from "@/types/intake";
import { ScannedMedicalDocument } from "@/types/document";
import { TRANSLATIONS } from "@/lib/translations";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { DocumentScanner } from "@/components/kiosk/DocumentScanner";
import { getActiveSession, saveActiveSession } from "@/lib/kioskStore";
import { SAMPLE_DOCUMENTS } from "@/data/sampleDocuments";
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function KioskDocumentsStep3Page() {
  const router = useRouter();
  const [session, setSession] = useState<PatientIntakeState | null>(null);
  const [language, setLanguage] = useState<LanguageCode>("hi");
  const [documents, setDocuments] = useState<ScannedMedicalDocument[]>([]);

  useEffect(() => {
    const existing = getActiveSession();
    if (existing) {
      setSession(existing);
      setLanguage(existing.patient.language || "hi");
      if (existing.scannedDocuments && existing.scannedDocuments.length > 0) {
        setDocuments(existing.scannedDocuments);
      } else {
        // Pre-load the first 2 documents for quick demonstrability
        setDocuments([SAMPLE_DOCUMENTS[0], SAMPLE_DOCUMENTS[1]]);
      }
    }
  }, []);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleFinish = () => {
    if (!session) return;

    // Collect all medications extracted from all scanned documents
    const extractedMedNames = documents.flatMap((d) =>
      d.extractedMedications.map((m) => `${m.name} ${m.dosage} (${m.frequency})`)
    );
    const combinedMedications = Array.from(
      new Set([...session.currentMedications, ...extractedMedNames])
    );

    const updatedState: PatientIntakeState = {
      ...session,
      scannedDocuments: documents,
      currentMedications: combinedMedications
    };

    saveActiveSession(updatedState);
    router.push("/kiosk/summary");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <KioskHeader
        currentStep={3}
        language={language}
        onLanguageChange={setLanguage}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <DocumentScanner
          scannedDocs={documents}
          onDocumentsUpdated={setDocuments}
          language={language}
        />

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => router.push("/kiosk/intake")}
            className="flex items-center space-x-1.5 px-6 py-3.5 rounded-2xl font-bold text-sm bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backButton}</span>
          </button>

          <button
            type="button"
            onClick={handleFinish}
            className="flex items-center space-x-2 px-8 py-4 rounded-2xl font-black text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 transition-all transform active:scale-95"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Generate Doctor Summary & OPD Slip</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </main>
    </div>
  );
}
