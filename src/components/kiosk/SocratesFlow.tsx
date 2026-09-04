"use client";

import React from "react";
import { SocratesAssessment, LanguageCode } from "@/types/intake";
import { AlertCircle, MapPin, Clock, Flame, ShieldAlert, Sparkles } from "lucide-react";

interface SocratesFlowProps {
  socrates: SocratesAssessment;
  onChange: (updated: SocratesAssessment) => void;
  language: LanguageCode;
}

export const SocratesFlow: React.FC<SocratesFlowProps> = ({
  socrates,
  onChange,
  language
}) => {
  const isHi = language === "hi";

  const painCharacters = [
    { id: "crushing", label: "Crushing / Squeezing Pressure", hi: "भारी दबाव / कुचलने जैसा" },
    { id: "sharp", label: "Sharp / Stabbing Pain", hi: "सुई जैसी तेज चुभन" },
    { id: "throbbing", label: "Throbbing / Pulsating", hi: "धक-धक करता दर्द" },
    { id: "burning", label: "Burning / Acidity", hi: "जलन जैसा दर्द" },
    { id: "dull", label: "Dull Constant Ache", hi: "धीमा लगातार दर्द" }
  ];

  const radiationOptions = [
    { id: "left_arm_jaw", label: "Left Arm / Shoulder / Jaw", hi: "बाएं हाथ / कंधे / जबड़े की ओर" },
    { id: "back", label: "Upper Back / Shoulder Blades", hi: "पीठ / कंधों के बीच" },
    { id: "abdomen", label: "Lower Abdomen / Groin", hi: "निचले पेट / कमर की तरफ" },
    { id: "nowhere", label: "Nowhere / Stays in one spot", hi: "कहीं नहीं, एक ही जगह पर है" }
  ];

  const associatedSymptomsList = [
    { id: "cold_sweat", label: "Profuse Cold Sweating", hi: "ठंडा पसीना छूटना" },
    { id: "breathless", label: "Breathlessness / Panting", hi: "सांस फूलना" },
    { id: "nausea", label: "Nausea or Vomiting", hi: "उल्टी या जी मिचलाना" },
    { id: "dizziness", label: "Giddiness / Fainting feeling", hi: "चक्कर आना या बेहोशी" },
    { id: "fever", label: "High Fever / Shivering", hi: "तेज बुखार व कंपकंपी" }
  ];

  const handleToggleAssociated = (symLabel: string) => {
    const exists = socrates.associatedSymptoms.includes(symLabel);
    const updated = exists
      ? socrates.associatedSymptoms.filter((s) => s !== symLabel)
      : [...socrates.associatedSymptoms, symLabel];
    onChange({ ...socrates, associatedSymptoms: updated });
  };

  const getSeverityColor = (sev: number) => {
    if (sev <= 3) return "bg-emerald-500 text-white";
    if (sev <= 6) return "bg-amber-500 text-white";
    return "bg-rose-600 text-white";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
              S
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {isHi ? "दर्द / लक्षण का गहराई से विश्लेषण (SOCRATES)" : "Clinical Symptom Characterization (SOCRATES Protocol)"}
              </h3>
              <p className="text-xs text-slate-500">
                {isHi
                  ? "डॉक्टर के लिए लक्षण का सटीक स्वरूप निर्धारित करें"
                  : "Adaptive clinical questions to isolate pathological etiology before doctor consult"}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Standard OPD Protocol
          </span>
        </div>

        {/* 1. Character of Pain / Symptom */}
        <div className="mt-5">
          <label className="block text-sm font-bold text-slate-800 mb-2">
            {isHi ? "1. दर्द या परेशानी किस प्रकार की है? (Character)" : "1. What does the pain or discomfort feel like?"}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {painCharacters.map((c) => {
              const selected = socrates.character.includes(c.label) || socrates.character.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onChange({ ...socrates, character: c.label })}
                  className={`p-3.5 rounded-2xl text-left border-2 font-medium text-sm transition-all ${
                    selected
                      ? "border-sky-600 bg-sky-50 text-sky-900 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <div className="font-semibold">{isHi ? c.hi : c.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{isHi ? c.label : c.hi}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Radiation (Does it spread?) */}
        <div className="mt-5">
          <label className="block text-sm font-bold text-slate-800 mb-2">
            {isHi ? "2. क्या दर्द शरीर के किसी अन्य हिस्से में फैलता है? (Radiation)" : "2. Does the discomfort spread anywhere else?"}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {radiationOptions.map((r) => {
              const selected = socrates.radiation.includes(r.label) || socrates.radiation.includes(r.id);
              const isArm = r.id === "left_arm_jaw";
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onChange({ ...socrates, radiation: r.label })}
                  className={`p-3.5 rounded-2xl text-left border-2 font-medium text-sm transition-all ${
                    selected
                      ? isArm
                        ? "border-rose-600 bg-rose-50 text-rose-900 shadow-sm"
                        : "border-sky-600 bg-sky-50 text-sky-900 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{isHi ? r.hi : r.label}</span>
                    {isArm && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                        Red Flag Signal
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{isHi ? r.label : r.hi}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Associated Symptoms */}
        <div className="mt-5">
          <label className="block text-sm font-bold text-slate-800 mb-2">
            {isHi ? "3. साथ में अन्य कौन से लक्षण महसूस हो रहे हैं? (Associated Symptoms)" : "3. Any other associated symptoms?"}
          </label>
          <div className="flex flex-wrap gap-2">
            {associatedSymptomsList.map((item) => {
              const active = socrates.associatedSymptoms.includes(item.label);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggleAssociated(item.label)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    active
                      ? "bg-slate-900 text-white border-slate-900 shadow"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {isHi ? item.hi : item.label} {active ? "✓" : "+"}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Severity (1 - 10 Visual Scale) */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-slate-800">
              {isHi ? "4. दर्द की गंभीरता (1 से 10 का पैमाना)" : "4. Pain / Distress Severity (Visual Analog Scale 1-10)"}
            </label>
            <span className={`px-3 py-1 rounded-full font-bold text-sm ${getSeverityColor(socrates.severity)}`}>
              Score: {socrates.severity} / 10 {socrates.severity >= 8 ? "(Severe / Urgent)" : socrates.severity >= 4 ? "(Moderate)" : "(Mild)"}
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={10}
            value={socrates.severity}
            onChange={(e) => onChange({ ...socrates, severity: parseInt(e.target.value, 10) })}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />

          <div className="flex justify-between text-xs text-slate-500 font-semibold mt-2 px-1">
            <span>1 (Mild / हल्का)</span>
            <span>5 (Moderate / मध्यम)</span>
            <span className="text-rose-600 font-bold">10 (Unbearable / असहनीय)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
