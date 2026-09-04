"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LanguageCode, PatientIntakeState, ChiefComplaintItem, SocratesAssessment } from "@/types/intake";
import { TRANSLATIONS } from "@/lib/translations";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { VoiceAssistant } from "@/components/kiosk/VoiceAssistant";
import { SocratesFlow } from "@/components/kiosk/SocratesFlow";
import { AyushAssessment } from "@/components/kiosk/AyushAssessment";
import { RedFlagAlertModal } from "@/components/kiosk/RedFlagAlertModal";
import { COMMON_COMPLAINTS, RED_FLAG_CRITERIA } from "@/data/medicalKnowledge";
import { getActiveSession, saveActiveSession, autoAssignDoctorForIntake } from "@/lib/kioskStore";
import { stopSpeaking } from "@/lib/speechHelper";
import {
  HeartPulse,
  Wind,
  Thermometer,
  Activity,
  Flame,
  Brain,
  Stethoscope,
  ZapOff,
  Leaf,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldAlert
} from "lucide-react";

export default function KioskIntakeStep2Page() {
  const router = useRouter();

  // Initialize session and language directly from saved state so there is NEVER a language switch/echo on mount
  const [session, setSession] = useState<PatientIntakeState | null>(() => {
    if (typeof window !== "undefined") {
      return getActiveSession();
    }
    return null;
  });

  const [language, setLanguage] = useState<LanguageCode>(() => {
    if (typeof window !== "undefined") {
      const existing = getActiveSession();
      if (existing?.patient?.language) {
        return existing.patient.language;
      }
    }
    return "hi";
  });

  const [selectedComplaints, setSelectedComplaints] = useState<ChiefComplaintItem[]>(() => {
    if (typeof window !== "undefined") {
      const existing = getActiveSession();
      if (existing?.chiefComplaints && existing.chiefComplaints.length > 0) {
        return existing.chiefComplaints;
      }
    }
    return [];
  });

  const [socrates, setSocrates] = useState<SocratesAssessment>(() => {
    if (typeof window !== "undefined") {
      const existing = getActiveSession();
      if (existing?.socrates && existing.socrates.site) {
        return existing.socrates;
      }
    }
    return {
      site: "Chest / Generalized",
      onset: "2 days ago",
      character: "Aching discomfort",
      radiation: "None",
      associatedSymptoms: [],
      timeCourse: "Constant",
      exacerbatingFactors: "Walking",
      relievingFactors: "Rest",
      severity: 6
    };
  });

  const [isAyushMode, setIsAyushMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const existing = getActiveSession();
      return Boolean(existing?.isAyushMode);
    }
    return false;
  });

  const [ayushAssessment, setAyushAssessment] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const existing = getActiveSession();
      if (existing?.ayushAssessment) {
        return existing.ayushAssessment;
      }
    }
    return {
      dashavidha: {
        prakriti: {
          primary: "Vata-Kapha",
          vataScore: 45,
          pittaScore: 20,
          kaphaScore: 35,
          characteristics: ["Lean build", "Prone to dry skin and joint stiffness"]
        },
        vikriti: {
          aggravatedDosha: "Vata-Kapha",
          symptoms: ["Ama formation", "Sandhishoola (Joint pain)"],
          severity: "Madhyama"
        },
        sara: { type: "Asthi", quality: "Madhyama" },
        samhanana: "Madhyama",
        pramana: "Sama",
        satmya: "Madhyama",
        sattva: "Madhyama",
        aharaShakti: {
          abhyavaharanaShakti: "Medium",
          jaranaShakti: "Low",
          agni: "Manda"
        },
        vyayamaShakti: "Avara",
        vaya: "Madhyama"
      },
      koshtha: "Krura",
      nidana: [
        "Viruddha Ahara (Incompatible diet)",
        "Divaswapna (Daytime sleeping)"
      ],
      sampraptiGhataka: {
        dosha: "Vata-Kapha",
        dushya: "Asthi, Sandhi",
        srotas: "Rasavaha",
        srotodushtiType: "Sanga"
      },
      trividhaPariksha: {
        darshana: "Joint swelling present",
        sparshana: "Warmth over joints",
        prashna: "Stiffness worse in early morning"
      },
      ashtavidhaPariksha: {
        nadi: "Manda, Sama Nadi",
        mutra: "Peeta varna (pale yellow)",
        mala: "Vibandha (constipated)",
        jihva: "Upalipta (coated white tongue)",
        shabda: "Normal",
        sparsha: "Dry skin",
        drik: "Normal",
        akriti: "Guarded posture"
      }
    };
  });

  const [activeRedFlag, setActiveRedFlag] = useState<any | null>(null);

  // Sync state if active session is refreshed
  useEffect(() => {
    const existing = getActiveSession();
    if (existing) {
      setSession(existing);
      if (existing.patient.language) {
        setLanguage(existing.patient.language);
      }
    }
  }, []);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isHi = language === "hi";

  // Dedicated prompt text per language to prevent mismatch
  const PROMPTS_BY_LANG: Record<LanguageCode, string> = {
    hi: "नमस्ते, आज आपको क्या मुख्य स्वास्थ्य परेशानी या बीमारी है? बोलकर या छूकर बताएं।",
    en: "Hello, what is your main health symptom or complaint today? Please speak or tap below.",
    ta: "வணக்கம், இன்று உங்கள் முக்கிய உடல்நலப் பிரச்சினை என்ன? பேசவும் அல்லது திரையைத் தொடவும்.",
    te: "నమస్కారం, ఈ రోజు మీ ప్రధాన ఆరోగ్య సమస్య ఏమిటి? మాట్లాడండి లేదా తాకండి.",
    kn: "ನಮಸ್ಕಾರ, ಇಂದು ನಿಮ್ಮ ಮುಖ್ಯ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಏನು? ಮಾತನಾಡಿ ಅಥವಾ ಸ್ಪರ್ಶಿಸಿ.",
    bn: "নমস্কার, আজ আপনার প্রধান শারীরিক समस्या কী? বলুন বা স্পর্শ করুন।"
  };
  const currentPromptText = PROMPTS_BY_LANG[language] || PROMPTS_BY_LANG.en;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "HeartPulse":
        return <HeartPulse className="w-6 h-6 text-rose-600" />;
      case "Wind":
        return <Wind className="w-6 h-6 text-sky-600" />;
      case "Thermometer":
        return <Thermometer className="w-6 h-6 text-amber-600" />;
      case "Activity":
        return <Activity className="w-6 h-6 text-emerald-600" />;
      case "Flame":
        return <Flame className="w-6 h-6 text-orange-600" />;
      case "Brain":
        return <Brain className="w-6 h-6 text-purple-600" />;
      case "Stethoscope":
        return <Stethoscope className="w-6 h-6 text-indigo-600" />;
      default:
        return <ZapOff className="w-6 h-6 text-slate-600" />;
    }
  };

  const handleToggleComplaint = (complaint: ChiefComplaintItem) => {
    const exists = selectedComplaints.some((c) => c.id === complaint.id);
    let updated: ChiefComplaintItem[];
    if (exists) {
      updated = selectedComplaints.filter((c) => c.id !== complaint.id);
    } else {
      updated = [...selectedComplaints, complaint];
    }
    setSelectedComplaints(updated);

    // Evaluate Red Flag
    checkRedFlags(updated, socrates);
  };

  const handleVoiceInput = (transcript: string) => {
    const lower = transcript.toLowerCase();
    if (lower.includes("छाती") || lower.includes("chest") || lower.includes("दर्द") || lower.includes("pain")) {
      handleToggleComplaint(COMMON_COMPLAINTS[0]);
    }
    if (lower.includes("सांस") || lower.includes("breath")) {
      handleToggleComplaint(COMMON_COMPLAINTS[1]);
    }
    if (lower.includes("जोड़") || lower.includes("joint") || lower.includes("वात")) {
      handleToggleComplaint(COMMON_COMPLAINTS[3]);
      setIsAyushMode(true);
    }
  };

  const checkRedFlags = (complaints: ChiefComplaintItem[], soc: SocratesAssessment) => {
    const hasChestPain = complaints.some((c) => c.id === "chest_pain");
    const hasBreathless = complaints.some((c) => c.id === "shortness_of_breath");
    const radiatesToArm =
      soc.radiation.toLowerCase().includes("arm") || soc.radiation.toLowerCase().includes("बाएं");

    if ((hasChestPain && radiatesToArm) || (hasChestPain && hasBreathless && soc.severity >= 7)) {
      setActiveRedFlag(RED_FLAG_CRITERIA[0]);
    }
  };

  const handleSocratesChange = (updated: SocratesAssessment) => {
    setSocrates(updated);
    checkRedFlags(selectedComplaints, updated);
  };

  const handleProceed = () => {
    stopSpeaking();
    const currentSession = session || getActiveSession();
    if (!currentSession) return;

    const assignment = autoAssignDoctorForIntake(
      activeRedFlag ? "Emergency" : "Routine",
      isAyushMode
    );

    const updatedState: PatientIntakeState = {
      ...currentSession,
      chiefComplaints: selectedComplaints,
      socrates: socrates,
      isAyushMode: isAyushMode,
      ayushAssessment: isAyushMode ? ayushAssessment : undefined,
      redFlagAlert: activeRedFlag ? { ...activeRedFlag, triggered: true } : undefined,
      patient: {
        ...currentSession.patient,
        language: language,
        triageCategory: activeRedFlag ? "Emergency" : "Routine",
        opdToken: activeRedFlag ? "EMERGENCY-01" : currentSession.patient.opdToken,
        assignedDoctorId: assignment.assignedDoctorId,
        assignedDoctorName: assignment.assignedDoctorName,
        assignedDepartment: assignment.assignedDepartment,
        assignedRoom: assignment.assignedRoom
      }
    };

    saveActiveSession(updatedState);
    router.push("/kiosk/documents");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <KioskHeader
        currentStep={2}
        language={language}
        onLanguageChange={(newLang) => {
          stopSpeaking();
          setLanguage(newLang);
        }}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Step 2 Title & Voice Assistant Banner - Speaks ONLY the selected language */}
        <VoiceAssistant
          language={language}
          promptText={currentPromptText}
          autoSpeakPrompt={true}
          onVoiceInput={handleVoiceInput}
        />

        {/* AYUSH Mode Switcher Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{t.ayushModeToggle}</div>
              <div className="text-xs text-slate-500">{t.ayushSubtitle}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAyushMode(!isAyushMode)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
              isAyushMode
                ? "bg-emerald-700 text-white shadow-emerald-700/20"
                : "bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200"
            }`}
          >
            {isAyushMode ? "✓ AYUSH Mode Active" : "+ Enable AYUSH Assessment"}
          </button>
        </div>

        {/* Common Symptom Chips (Big Touch Targets for Elderly) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {isHi ? "मुख्य लक्षण चुनें (Touch to Select)" : "Tap Your Primary Symptom:"}
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              {selectedComplaints.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {COMMON_COMPLAINTS.map((item) => {
              const isSelected = selectedComplaints.some((c) => c.id === item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggleComplaint(item)}
                  className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between min-h-[110px] ${
                    isSelected
                      ? item.isRedFlag
                        ? "border-rose-600 bg-rose-50 text-rose-950 shadow-md ring-2 ring-rose-200"
                        : "border-sky-600 bg-sky-50 text-sky-950 shadow-md ring-2 ring-sky-200"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {getIcon(item.iconName)}
                    {isSelected && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white shadow-xs">
                        ✓ Selected
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm mt-2">{isHi ? item.symptomHi : item.symptom}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{isHi ? item.symptom : item.symptomHi}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SOCRATES Flow (Adaptive Deep Clinical Interrogation) */}
        {selectedComplaints.length > 0 && (
          <SocratesFlow
            socrates={socrates}
            onChange={handleSocratesChange}
            language={language}
          />
        )}

        {/* AYUSH Dashavidha Pariksha (When AYUSH mode active) */}
        {isAyushMode && (
          <AyushAssessment
            assessment={ayushAssessment}
            onChange={setAyushAssessment}
            language={language}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              router.push("/kiosk");
            }}
            className="flex items-center space-x-1.5 px-6 py-3.5 rounded-2xl font-bold text-sm bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backButton}</span>
          </button>

          <button
            type="button"
            onClick={handleProceed}
            className="flex items-center space-x-2 px-8 py-4 rounded-2xl font-black text-base bg-sky-600 hover:bg-sky-500 text-white shadow-xl shadow-sky-600/30 transition-all transform active:scale-95"
          >
            <span>{t.nextButton}: Scan Documents</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* Red Flag Emergency Siren Modal */}
      {activeRedFlag && (
        <RedFlagAlertModal
          alert={activeRedFlag}
          language={language}
          onAcknowledge={() => {
            stopSpeaking();
            setActiveRedFlag(null);
          }}
        />
      )}
    </div>
  );
}
