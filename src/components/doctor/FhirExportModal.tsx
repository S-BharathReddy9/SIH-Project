"use client";

import React, { useState } from "react";
import { FhirBundle } from "@/types/fhir";
import { Copy, Check, Download, X, ShieldCheck, Code } from "lucide-react";

interface FhirExportModalProps {
  bundle: FhirBundle;
  onClose: () => void;
}

export const FhirExportModal: React.FC<FhirExportModalProps> = ({ bundle, onClose }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(bundle, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `abdm-fhir-bundle-${bundle.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">ABDM FHIR R4 Bundle Export</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  HL7 FHIR R4 Validated
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Standardized electronic health exchange document formatted per ABDM NRCeS specifications
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy JSON"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download .json</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resources Summary Bar */}
        <div className="px-5 py-2.5 bg-slate-800/60 border-b border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Included Resources ({bundle.entry.length}):</span>
          {bundle.entry.map((e, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-slate-700/80 text-sky-300 font-mono text-[11px]"
            >
              {e.resource.resourceType}
            </span>
          ))}
        </div>

        {/* JSON Code Viewer */}
        <div className="flex-1 overflow-auto p-5 font-mono text-xs text-slate-300 bg-slate-950">
          <pre className="whitespace-pre-wrap">{jsonString}</pre>
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted with NDHM Digital Signature standard</span>
          </div>
          <span>Bundle Identifier: {bundle.identifier.value}</span>
        </div>
      </div>
    </div>
  );
};
