"use client";

import React, { useState } from "react";
import { AyushClinicalAssessment, PrakritiDosha, AgniType, KoshthaType } from "@/types/ayush";
import { PRAKRITI_QUESTIONNAIRE, ASHTAVIDHA_PARIKSHA_LABELS } from "@/data/ayushTaxonomy";
import { Leaf, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";

interface AyushAssessmentProps {
  assessment: AyushClinicalAssessment;
  onChange: (updated: AyushClinicalAssessment) => void;
  language: string;
}

export const AyushAssessment: React.FC<AyushAssessmentProps> = ({
  assessment,
  onChange,
  language
}) => {
  const isHi = language === "hi";

  const agniOptions: { type: AgniType; label: string; hi: string; desc: string }[] = [
    { type: "Manda", label: "Manda Agni (Sluggish)", hi: "मन्दाग्नि (कफ)", desc: "Slow digestion, heaviness, low appetite, coated tongue" },
    { type: "Tikshna", label: "Tikshna Agni (Intense)", hi: "तीक्ष्णाग्नि (पित्त)", desc: "High appetite, rapid burning digestion, hyperacidity" },
    { type: "Vishama", label: "Vishama Agni (Irregular)", hi: "विषमाग्नि (वात)", desc: "Fluctuating appetite, gas, bloating, constipation" },
    { type: "Sama", label: "Sama Agni (Balanced)", hi: "समाग्नि (संतुलित)", desc: "Optimal digestion and regular timely hunger" }
  ];

  const koshthaOptions: { type: KoshthaType; label: string; hi: string; desc: string }[] = [
    { type: "Krura", label: "Krura Koshtha (Hard Bowels)", hi: "क्रूर कोष्ठ (वात)", desc: "Dry, hard stools, prone to constipation, needs strong purgatives" },
    { type: "Mrudu", label: "Mrudu Koshtha (Soft Bowels)", hi: "मृदु कोष्ठ (पित्त)", desc: "Frequent soft/loose stools, easily purged by warm milk" },
    { type: "Madhyama", label: "Madhyama Koshtha (Normal)", hi: "मध्यम कोष्ठ (कफ/सम)", desc: "Formed, regular once-daily bowel movements" }
  ];

  const commonNidanas = [
    { id: "viruddha_ahara", label: "Viruddha Ahara (Incompatible Diet / Milk + Salt)", hi: "विरुद्ध आहार (दूध-नमक संयोग)" },
    { id: "divaswapna", label: "Divaswapna (Daytime sleeping)", hi: "दिवास्वप्न (दिन में सोना)" },
    { id: "snigdha_guru", label: "Snigdha-Guru Ahara (Heavy oily fast foods)", hi: "स्निग्ध-गुरु आहार (तली-भुनी चीजें)" },
    { id: "avyayama", label: "Avyayama (Sedentary lifestyle)", hi: "अव्यायाम (शारीरिक निष्क्रियता)" },
    { id: "vegadharana", label: "Vega-Dharana (Suppression of natural urges)", hi: "वेग-धारण (शौच/पेशाब रोकना)" }
  ];

  const handleToggleNidana = (nidanaLabel: string) => {
    const exists = assessment.nidana.includes(nidanaLabel);
    const updated = exists
      ? assessment.nidana.filter((n) => n !== nidanaLabel)
      : [...assessment.nidana, nidanaLabel];
    onChange({ ...assessment, nidana: updated });
  };

  const handleSelectAgni = (agni: AgniType) => {
    onChange({
      ...assessment,
      dashavidha: {
        ...assessment.dashavidha,
        aharaShakti: {
          ...assessment.dashavidha.aharaShakti,
          agni
        }
      }
    });
  };

  const handleSelectKoshtha = (koshtha: KoshthaType) => {
    onChange({
      ...assessment,
      koshtha
    });
  };

  return (
    <div className="bg-emerald-50/50 border border-emerald-200 rounded-3xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-emerald-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-emerald-950">
                {isHi ? "आयुर्वेद दशविध एवं अष्टविध परीक्षा" : "Ayurvedic Dashavidha & Ashtavidha Pariksha"}
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                AYUSH Module
              </span>
            </div>
            <p className="text-xs text-emerald-700">
              {isHi
                ? "प्रकृति, विकृति, अग्नि, कोष्ठ एवं संप्राप्ति का पूर्ण मूल्यांकन"
                : "Holistic constitutional analysis: Prakriti, Agni, Koshtha, Nidana, and Samprapti"}
            </p>
          </div>
        </div>
      </div>

      {/* 1. Prakriti Distribution Score */}
      <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm">
        <h4 className="text-sm font-bold text-emerald-950 mb-1">
          {isHi ? "1. प्रकृति निर्धारण (Prakriti Analysis)" : "1. Prakriti Assessment (Body Constitution)"}
        </h4>
        <p className="text-xs text-slate-500 mb-3">
          {isHi ? "त्रिदोष संतुलन स्थिति (वात - पित्त - कफ)" : "Tridosha proportion profile based on clinical intake:"}
        </p>

        {/* Dosha Progress Bars */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-center">
            <span className="text-xs font-bold text-sky-800 uppercase">Vata (वात)</span>
            <div className="text-xl font-black text-sky-900 mt-0.5">
              {assessment.dashavidha.prakriti.vataScore}%
            </div>
            <div className="w-full bg-sky-200 h-1.5 rounded-full mt-2">
              <div
                className="bg-sky-600 h-1.5 rounded-full"
                style={{ width: `${assessment.dashavidha.prakriti.vataScore}%` }}
              />
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
            <span className="text-xs font-bold text-rose-800 uppercase">Pitta (पित्त)</span>
            <div className="text-xl font-black text-rose-900 mt-0.5">
              {assessment.dashavidha.prakriti.pittaScore}%
            </div>
            <div className="w-full bg-rose-200 h-1.5 rounded-full mt-2">
              <div
                className="bg-rose-600 h-1.5 rounded-full"
                style={{ width: `${assessment.dashavidha.prakriti.pittaScore}%` }}
              />
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
            <span className="text-xs font-bold text-emerald-800 uppercase">Kapha (कफ)</span>
            <div className="text-xl font-black text-emerald-900 mt-0.5">
              {assessment.dashavidha.prakriti.kaphaScore}%
            </div>
            <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-2">
              <div
                className="bg-emerald-600 h-1.5 rounded-full"
                style={{ width: `${assessment.dashavidha.prakriti.kaphaScore}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-600 flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Primary Prakriti Identified: <strong>{assessment.dashavidha.prakriti.primary}</strong> (Secondary: {assessment.dashavidha.vikriti.aggravatedDosha} Vikriti)
          </span>
        </div>
      </div>

      {/* 2. Agni Assessment */}
      <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm">
        <label className="block text-sm font-bold text-emerald-950 mb-1">
          {isHi ? "2. अग्नि परीक्षा (Digestive Capacity / Agni)" : "2. Agni Pariksha (Digestive Fire)"}
        </label>
        <p className="text-xs text-slate-500 mb-3">
          {isHi ? "पाचन शक्ति और भूख का स्वरूप चुनें:" : "Select the patient's dominant digestive state:"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {agniOptions.map((opt) => {
            const isSelected = assessment.dashavidha.aharaShakti.agni === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => handleSelectAgni(opt.type)}
                className={`p-3 rounded-xl text-left border-2 transition-all ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                }`}
              >
                <div className="font-bold text-sm">{isHi ? opt.hi : opt.label}</div>
                <div className="text-xs text-slate-500 mt-1">{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Koshtha Assessment */}
      <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm">
        <label className="block text-sm font-bold text-emerald-950 mb-1">
          {isHi ? "3. कोष्ठ परीक्षा (Bowel Habit Nature / Koshtha)" : "3. Koshtha Pariksha (Bowel Nature)"}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
          {koshthaOptions.map((opt) => {
            const isSelected = assessment.koshtha === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => handleSelectKoshtha(opt.type)}
                className={`p-3 rounded-xl text-left border-2 transition-all ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                }`}
              >
                <div className="font-bold text-sm">{isHi ? opt.hi : opt.label}</div>
                <div className="text-xs text-slate-500 mt-1">{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Nidana (Etiological Factors) */}
      <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm">
        <label className="block text-sm font-bold text-emerald-950 mb-1">
          {isHi ? "4. निदान सेवन (Ahara-Vihara Diet & Lifestyle Factors)" : "4. Ahara-Vihara (Dietary & Lifestyle Causative Factors)"}
        </label>
        <p className="text-xs text-slate-500 mb-2">
          {isHi ? "रोगी द्वारा किए जाने वाले अहितकर आहार-विहार:" : "Select unwholesome habits reported by patient:"}
        </p>
        <div className="flex flex-wrap gap-2">
          {commonNidanas.map((n) => {
            const active = assessment.nidana.includes(n.label);
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => handleToggleNidana(n.label)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  active
                    ? "bg-emerald-700 text-white border-emerald-700 shadow"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {isHi ? n.hi : n.label} {active ? "✓" : "+"}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Ashtavidha Pariksha Quick Preview */}
      <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm">
        <h4 className="text-sm font-bold text-emerald-950 mb-2">
          {isHi ? "5. अष्टविध परीक्षा सारांश (Ashtavidha Summary)" : "5. Ashtavidha Pariksha Clinical Observations"}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {ASHTAVIDHA_PARIKSHA_LABELS.map((item) => {
            const val = (assessment.ashtavidhaPariksha as any)[item.key] || "Normal";
            return (
              <div key={item.key} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block">{isHi ? item.hi : item.label}</span>
                <span className="text-slate-600 italic block truncate mt-0.5" title={val}>
                  {val}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
