"use client";

import React, { useState } from "react";
import { ScannedMedicalDocument, ExtractedLabTest, ExtractedMedication } from "@/types/document";
import { SAMPLE_DOCUMENTS } from "@/data/sampleDocuments";
import { parseMedicalText } from "@/lib/ocrExtractor";
import {
  FileText,
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Pill,
  Activity,
  FileCheck,
  ChevronRight,
  Sparkles,
  Layers
} from "lucide-react";

interface DocumentScannerProps {
  scannedDocs: ScannedMedicalDocument[];
  onDocumentsUpdated: (docs: ScannedMedicalDocument[]) => void;
  language: string;
}

export const DocumentScanner: React.FC<DocumentScannerProps> = ({
  scannedDocs,
  onDocumentsUpdated,
  language
}) => {
  const isHi = language === "hi";
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(
    scannedDocs.length > 0 ? scannedDocs[0].id : null
  );

  const handleAddSampleDoc = (doc: ScannedMedicalDocument) => {
    setIsProcessing(true);
    setProcessingProgress(20);
    setProcessingStage("Document uploaded ✓");
    const progressTimer = window.setInterval(() => {
      setProcessingProgress((current) => Math.min(current + 20, 80));
      setProcessingStage((current) =>
        current === "Document uploaded ✓" ? "Reading document..." : "Extracting medical information..."
      );
    }, 200);
    setTimeout(() => {
      window.clearInterval(progressTimer);
      const exists = scannedDocs.some((d) => d.id === doc.id);
      let updated: ScannedMedicalDocument[];
      if (exists) {
        updated = scannedDocs.map((d) => (d.id === doc.id ? doc : d));
      } else {
        updated = [...scannedDocs, doc];
      }
      // Sort chronologically (newest first)
      updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      onDocumentsUpdated(updated);
      setSelectedDocId(doc.id);
      setProcessingProgress(100);
      setProcessingStage("Extraction complete ✓");
      setIsProcessing(false);
    }, 800);
  };

  const handleSimulateCustomUpload = () => {
    setIsProcessing(true);
    setProcessingProgress(20);
    setProcessingStage("Document uploaded ✓");
    const progressTimer = window.setInterval(() => {
      setProcessingProgress((current) => Math.min(current + 20, 80));
      setProcessingStage((current) =>
        current === "Document uploaded ✓" ? "Reading document..." : "Extracting medical information..."
      );
    }, 300);
    setTimeout(() => {
      window.clearInterval(progressTimer);
      const mockRawText = `DISTRICT LAB & CLINIC
Date: 2024-09-01  Pt: Patient Intake
Fasting Blood Sugar: 188 mg/dL (Normal: 70-100)
Hemoglobin: 9.4 g/dL (Normal: 12.0-15.5)
Rx: Tab Metformin 500 mg 1-0-1 BD
Tab Atorvastatin 10 mg 0-0-1 HS`;

      const parsed = parseMedicalText(mockRawText);
      const newDoc: ScannedMedicalDocument = {
        id: `DOC-LIVE-${Date.now()}`,
        title: "Live Scanned Document / Prescription Slip",
        documentType: "Prescription",
        date: new Date().toISOString().split("T")[0],
        facilityOrDoctor: "Local Hospital / Clinic OPD",
        rawOcrText: mockRawText,
        isHandwritten: true,
        confidenceScore: 95,
        extractedDiagnoses: parsed.diagnoses.length > 0 ? parsed.diagnoses : ["Metabolic Syndrome"],
        extractedMedications: parsed.medications,
        extractedLabTests: parsed.labTests,
        highlightedAnomalies: parsed.anomalies
      };

      const updated = [newDoc, ...scannedDocs].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      onDocumentsUpdated(updated);
      setSelectedDocId(newDoc.id);
      setProcessingProgress(100);
      setProcessingStage("Extraction complete ✓");
      setIsProcessing(false);
    }, 1200);
  };

  const activeDoc = scannedDocs.find((d) => d.id === selectedDocId) || scannedDocs[0];
  const sortedDocuments = [...scannedDocs].sort((a, b) =>
    sortOrder === "newest"
      ? new Date(b.date).getTime() - new Date(a.date).getTime()
      : new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Aggregate abnormal lab tests across all uploaded documents
  const allAbnormalLabs = scannedDocs.flatMap((d) =>
    (d.extractedLabTests || []).filter((l) => l.abnormalFlag)
  );

  return (
    <div className="space-y-6">
      {/* Upload Zone & Quick Sample Picker */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isHi ? "पुराने मेडिकल पर्चे एवं जांच रिपोर्ट स्कैनर" : "Medical Document Ingestion & AI OCR Engine"}
            </h3>
            <p className="text-xs text-slate-500">
              {isHi
                ? "हाथ से लिखे पर्चे या खून जांच रिपोर्ट अपलोड करें - एआई सभी जानकारी निकाल लेगा"
                : "Scan handwritten prescriptions or lab reports to automatically digitize clinical entities and lab trends"}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
            {scannedDocs.length} {isHi ? "दस्तावेज स्कैन किए गए" : "Documents Digitized"}
          </span>
        </div>

        {/* Action Upload Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          <button
            type="button"
            onClick={handleSimulateCustomUpload}
            disabled={isProcessing}
            className="flex items-center justify-center space-x-3 p-5 rounded-2xl border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/50 hover:bg-sky-50 transition-all text-sky-900 group"
          >
            <Camera className="w-6 h-6 text-sky-600 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="font-bold text-sm">
                {isHi ? "कियोस्क कैमरे से पर्चा स्कैन करें" : "Scan Paper Document via Kiosk Camera"}
              </div>
              <div className="text-xs text-sky-600">
                {isHi ? "सामने कैमरे के नीचे पर्चा रखें" : "Place document in scanning cradle"}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleSimulateCustomUpload}
            disabled={isProcessing}
            className="flex items-center justify-center space-x-3 p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 transition-all text-slate-800 group"
          >
            <Upload className="w-6 h-6 text-slate-600 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="font-bold text-sm">
                {isHi ? "डिजिटल फाइल / फोटो अपलोड करें" : "Upload File (PDF / JPG / PNG)"}
              </div>
              <div className="text-xs text-slate-500">
                {isHi ? "स्मार्टफोन या डिस्क से चुनें" : "From USB drive or mobile upload"}
              </div>
            </div>
          </button>
        </div>

        {/* Quick Sample Document Selector for Instant Hackathon Demonstration */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            {isHi ? "त्वरित परीक्षण हेतु वास्तविक नमूना रिपोर्ट चुनें:" : "Or load authentic Indian medical samples to test OCR live:"}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SAMPLE_DOCUMENTS.map((doc) => {
              const isAdded = scannedDocs.some((d) => d.id === doc.id);
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => handleAddSampleDoc(doc)}
                  className={`p-3 rounded-xl text-left border transition-all text-xs ${
                    isAdded
                      ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold truncate">{doc.documentType}</span>
                    {isAdded ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-[10px] text-sky-600 font-bold">+ Load</span>
                    )}
                  </div>
                  <div className="text-slate-500 truncate" title={doc.title}>
                    {doc.title}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">{doc.date}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="mt-4 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-sky-600 animate-spin" />
              <div className="text-sm font-semibold">{processingStage}</div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-sky-100 overflow-hidden">
              <div className="h-full rounded-full bg-sky-600 transition-all" style={{ width: `${processingProgress}%` }} />
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-sky-700">
              <span>{processingProgress}%</span>
              <span>Extracting medicines, diagnoses and lab values</span>
            </div>
          </div>
        )}
      </div>

      {/* Critical Abnormal Lab Highlights Banner (e.g. Hemoglobin 8.2 g/dL) */}
      {allAbnormalLabs.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 shadow-sm">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-rose-950 text-base">
                {isHi ? "सावधानी: जांच रिपोर्ट में असामान्य मान पाए गए (Abnormal Lab Values)" : "CRITICAL ALERT: Abnormal Laboratory Values Detected via OCR"}
              </h4>
              <p className="text-xs text-rose-800 mt-0.5">
                {isHi
                  ? "डॉक्टर के परामर्श से पूर्व एआई ने इन महत्वपूर्ण असामान्य रिपोर्टों को रेखांकित किया है:"
                  : "MediKiosk automated intelligence flagged these critical out-of-range parameters for priority doctor review:"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                {allAbnormalLabs.map((lab, idx) => (
                  <div
                    key={`${lab.id}-${idx}`}
                    className="bg-white p-3 rounded-xl border border-rose-200 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{lab.testName}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-600 text-white">
                        {lab.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-lg font-black text-rose-700 mt-1">
                      {lab.value} <span className="text-xs text-slate-500 font-normal">{lab.unit}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Normal: {lab.referenceRange} {lab.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chronological Timeline & Extracted Data Viewer */}
      {scannedDocs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document Timeline Sidebar */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-sky-600" />
                <h4 className="font-bold text-slate-900 text-sm">
                  {isHi ? "कालानुक्रमिक मेडिकल टाइमलाइन" : "Medical Timeline"}
                </h4>
              </div>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest")}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-600"
                aria-label="Sort timeline by date"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>

            <div className="space-y-3">
              {sortedDocuments.map((doc, idx) => {
                const isSelected = doc.id === (activeDoc?.id || "");
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-sky-50 border-sky-600 ring-2 ring-sky-100 shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-sky-800">{doc.date}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white text-[10px] font-bold border">
                        {doc.confidenceScore}% OCR Match
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm truncate">{doc.title}</div>
                    <div className="text-xs text-slate-500 truncate mt-0.5">{doc.facilityOrDoctor}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.extractedDiagnoses.length > 0 && <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">Diagnoses</span>}
                      {doc.extractedLabTests.length > 0 && <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">Reports</span>}
                      {doc.extractedMedications.length > 0 && <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">Medicines</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Document Entity Breakdown */}
          {activeDoc && (
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{activeDoc.title}</h4>
                  <p className="text-xs text-slate-500">
                    {activeDoc.facilityOrDoctor} • {activeDoc.date} • {activeDoc.isHandwritten ? "Handwritten Script" : "Printed Report"}
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Digitized & Structured
                </span>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
               <div className="flex items-center gap-2">
                 <FileCheck className="w-5 h-5 text-indigo-600" />
                 <h5 className="text-sm font-black text-indigo-950">Extracted Information</h5>
               </div>
               <p className="mt-1 text-xs text-indigo-800">
                 AI OCR structured this {activeDoc.isHandwritten ? "handwritten" : "printed"} document into medicines,
                 diagnoses, reports, and important clinical events.
               </p>
              </div>

              {/* Extracted Diagnoses */}
              {activeDoc.extractedDiagnoses.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    {isHi ? "पहचाने गए रोग / निदान (Extracted Diagnoses):" : "Extracted Clinical Diagnoses:"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {activeDoc.extractedDiagnoses.map((diag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 text-xs font-bold"
                      >
                        {diag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Medications */}
              {activeDoc.extractedMedications.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    {isHi ? "पहचानी गई दवाइयां एवं खुराक (Prescribed Medications):" : "Prescribed Medications with Dosages:"}
                  </label>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b">
                        <tr>
                          <th className="p-2.5">Medicine Name</th>
                          <th className="p-2.5">Dosage</th>
                          <th className="p-2.5">Frequency</th>
                          <th className="p-2.5">Timing</th>
                          <th className="p-2.5">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeDoc.extractedMedications.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-900">{m.name}</td>
                            <td className="p-2.5 text-slate-700">{m.dosage}</td>
                            <td className="p-2.5 text-slate-700 font-semibold">{m.frequency}</td>
                            <td className="p-2.5 text-slate-500">{m.timing || "As advised"}</td>
                            <td className="p-2.5 text-slate-500">{m.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Extracted Lab Tests */}
              {activeDoc.extractedLabTests.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    {isHi ? "जांच परिणाम एवं सामान्य संदर्भ सीमा:" : "Extracted Laboratory Test Results:"}
                  </label>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b">
                        <tr>
                          <th className="p-2.5">Test Parameter</th>
                          <th className="p-2.5">Observed Value</th>
                          <th className="p-2.5">Reference Range</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeDoc.extractedLabTests.map((l) => (
                          <tr key={l.id} className={l.abnormalFlag ? "bg-rose-50/50" : "hover:bg-slate-50"}>
                            <td className="p-2.5 font-bold text-slate-900">{l.testName}</td>
                            <td className="p-2.5">
                              <span className={`font-black ${l.abnormalFlag ? "text-rose-700" : "text-slate-800"}`}>
                                {l.value} {l.unit}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-500">{l.referenceRange} {l.unit}</td>
                            <td className="p-2.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  l.status === "Low" || l.status === "Critical"
                                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                                    : l.status === "High"
                                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                }`}
                              >
                                {l.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Raw OCR Text Toggle Preview */}
              <div className="pt-2">
                <details className="text-xs text-slate-500 cursor-pointer">
                  <summary className="font-semibold text-slate-600 hover:text-slate-900">
                    View Raw OCR Machine Transcription
                  </summary>
                  <pre className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                    {activeDoc.rawOcrText}
                  </pre>
                </details>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
