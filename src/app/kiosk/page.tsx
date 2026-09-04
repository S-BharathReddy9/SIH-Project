"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LanguageCode, PatientIntakeState } from "@/types/intake";
import { TRANSLATIONS } from "@/lib/translations";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { speakText, stopSpeaking } from "@/lib/speechHelper";
import { saveActiveSession, clearActiveSession } from "@/lib/kioskStore";
import {
  ShieldCheck,
  QrCode,
  User,
  UserRound,
  Search,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Smartphone,
  Lock
} from "lucide-react";

export default function KioskStep1Page() {
  const router = useRouter();
  const [language, setLanguage] = useState<LanguageCode>("hi");
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isHi = language === "hi";

  const [patientType, setPatientType] = useState<"New" | "Existing">("New");
  const [existingPatientId, setExistingPatientId] = useState("");
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registeredPatientId, setRegisteredPatientId] = useState("");
  const [registeredToken, setRegisteredToken] = useState("");
  // Form starts clean and isolated for each patient to protect privacy under DPDP Act 2023
  const [abhaInput, setAbhaInput] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Female");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [dataUseAgreed, setDataUseAgreed] = useState(false);
  const [isSpeakingConsent, setIsSpeakingConsent] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        stopSpeaking();
        clearActiveSession();
        alert("This patient session expired for your privacy. Please start again.");
        router.push("/");
      }, 15 * 60 * 1000);
    };

    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];
    resetTimeout();
    activityEvents.forEach((eventName) => window.addEventListener(eventName, resetTimeout, { passive: true }));

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, resetTimeout));
    };
  }, [router]);

  const handleSpeakConsent = () => {
    stopSpeaking();
    setIsSpeakingConsent(true);
    speakText(t.dpdpConsentBody, language, () => {
      setIsSpeakingConsent(false);
    });
  };

  // Pre-load demo details only when explicitly requested
  const handleSimulateAbhaScan = () => {
    setAbhaInput("91-4921-8812-3401");
    setName("Sunita Devi");
    setAge("48");
    setGender("Female");
    setPhone("+91 94150 11223");
    setConsentAgreed(true);
    setDataUseAgreed(true);
  };

  const handleExistingLookup = () => {
    if (!existingPatientId.trim()) {
      alert("Please enter your Hospital Patient ID.");
      return;
    }

    if (existingPatientId.trim().toUpperCase() === "P20260904001") {
      setName("Rahul Kumar");
      setDateOfBirth("1990-05-12");
      setAge("36");
      setGender("Male");
      setPhone("+91 98765 43210");
      setAddress("District Hospital catchment area");
      setAbhaInput("91-4921-8812-3401");
      return;
    }

    alert("Demo patient not found. Try P20260904001.");
  };

  const handleProceed = () => {
    if (!name.trim()) {
      alert(
        isHi
          ? "कृपया मरीज का नाम दर्ज करें या आभा (ABHA) कार्ड स्कैन करें।"
          : "Please enter patient name or scan an ABHA card."
      );
      return;
    }

    if (!age || isNaN(Number(age)) || Number(age) <= 0) {
      alert(
        isHi
          ? "कृपया सही उम्र (वर्ष) दर्ज करें।"
          : "Please enter a valid age."
      );
      return;
    }

    if (!consentAgreed || !dataUseAgreed) {
      alert(
        isHi
          ? "कृपया डिजिटल डेटा संरक्षण (DPDP) अधिनियम 2023 के तहत सहमति दें।"
          : "Please provide consent per DPDP Act 2023 to proceed."
      );
      return;
    }

    const patientId =
      patientType === "Existing"
        ? existingPatientId.trim().toUpperCase()
        : `P${new Date().toISOString().slice(0, 10).replace(/-/g, "")}${Math.floor(100 + Math.random() * 900)}`;
    const token = `A-${Math.floor(100 + Math.random() * 900)}`;

    setRegisteredPatientId(patientId);
    setRegisteredToken(token);
    setRegistrationComplete(true);
    return;
  };

  const continueToIntake = () => {
    // Isolate this session completely
    clearActiveSession();

    const state: PatientIntakeState = {
      patient: {
        id: registeredPatientId,
        name: name.trim(),
        dateOfBirth: dateOfBirth || undefined,
        age: parseInt(age, 10),
        gender: gender,
        abhaId: abhaInput.trim()
          ? (abhaInput.includes("@") ? abhaInput.trim() : `${abhaInput.trim()}@abdm`)
          : "ABHA-NEW-REG",
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        patientType,
        status: "WAITING",
        language: language,
        consentGiven: true,
        consentTimestamp: new Date().toISOString(),
        opdToken: registeredToken,
        triageCategory: "Routine",
        intakeTimestamp: new Date().toISOString()
      },
      chiefComplaints: [],
      socrates: {
        site: "",
        onset: "",
        character: "",
        radiation: "",
        associatedSymptoms: [],
        timeCourse: "",
        exacerbatingFactors: "",
        relievingFactors: "",
        severity: 5
      },
      isAyushMode: false,
      pastMedicalHistory: [],
      pastSurgicalHistory: [],
      currentMedications: [],
      knownAllergies: [],
      familyHistory: [],
      personalHistory: {
        diet: "Vegetarian",
        smoking: "Never",
        alcohol: "Never",
        bowelHabits: "Normal",
        appetite: "Normal"
      },
      reviewOfSystems: [],
      scannedDocuments: [],
      doctorConfirmed: false
    };

    stopSpeaking();
    saveActiveSession(state);
    router.push("/kiosk/intake");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <KioskHeader
        currentStep={1}
        language={language}
        onLanguageChange={(newLang) => {
          stopSpeaking();
          setLanguage(newLang);
        }}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {!registrationComplete && (
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <UserRound className="w-6 h-6 text-sky-300" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-sky-300">Patient registration</p>
                <h2 className="text-xl font-black">Are you a new or existing patient?</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              <button
                type="button"
                onClick={() => {
                  setPatientType("New");
                  setExistingPatientId("");
                }}
                className={`rounded-2xl border-2 p-4 text-left font-bold transition-all ${
                  patientType === "New" ? "border-sky-400 bg-sky-500/20" : "border-slate-700 hover:border-slate-500"
                }`}
              >
                🆕 New Patient
                <span className="block text-xs font-normal text-slate-300 mt-1">Create a hospital patient ID</span>
              </button>
              <button
                type="button"
                onClick={() => setPatientType("Existing")}
                className={`rounded-2xl border-2 p-4 text-left font-bold transition-all ${
                  patientType === "Existing" ? "border-sky-400 bg-sky-500/20" : "border-slate-700 hover:border-slate-500"
                }`}
              >
                👤 Existing Patient
                <span className="block text-xs font-normal text-slate-300 mt-1">Retrieve an existing hospital record</span>
              </button>
            </div>
            {patientType === "Existing" && (
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <input
                  value={existingPatientId}
                  onChange={(event) => setExistingPatientId(event.target.value)}
                  placeholder="Enter Hospital Patient ID"
                  className="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-3 py-3 text-sm text-white placeholder:text-slate-400"
                />
                <button type="button" onClick={handleExistingLookup} className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold hover:bg-sky-500">
                  <Search className="w-4 h-4" /> Retrieve patient
                </button>
              </div>
            )}
          </div>
        )}

        {registrationComplete && (
          <div className="rounded-3xl border-2 border-emerald-300 bg-emerald-50 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="w-6 h-6" />
              <h2 className="text-xl font-black">Registration Successful</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 text-sm">
              <div><p className="text-xs text-emerald-700">Patient Name</p><p className="font-black text-slate-900">{name}</p></div>
              <div><p className="text-xs text-emerald-700">Patient ID</p><p className="font-black font-mono text-slate-900">{registeredPatientId}</p></div>
              <div><p className="text-xs text-emerald-700">Token No.</p><p className="font-black text-slate-900">{registeredToken}</p></div>
            </div>
            <p className="mt-5 text-sm text-emerald-900">Please proceed to MediKiosk AI case taking.</p>
            <button type="button" onClick={continueToIntake} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800">
              Continue to AI case taking <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {!registrationComplete && (
        <>
         {/* Language Selection Card (Accessible, Large Buttons) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <label className="block text-sm font-bold text-slate-800 mb-3">
            {t.selectLanguage}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {[
              { code: "hi", name: "हिंदी", sub: "Hindi" },
              { code: "en", name: "English", sub: "English" },
              { code: "ta", name: "தமிழ்", sub: "Tamil" },
              { code: "te", name: "తెలుగు", sub: "Telugu" },
              { code: "kn", name: "ಕನ್ನಡ", sub: "Kannada" },
              { code: "bn", name: "বাংলা", sub: "Bengali" }
            ].map((langItem) => {
              const selected = language === langItem.code;
              return (
                <button
                  key={langItem.code}
                  type="button"
                  onClick={() => {
                    stopSpeaking();
                    setLanguage(langItem.code as LanguageCode);
                    speakText(TRANSLATIONS[langItem.code as LanguageCode].step1Title, langItem.code as LanguageCode);
                  }}
                  className={`p-3 rounded-2xl text-center border-2 transition-all ${
                    selected
                      ? "border-sky-600 bg-sky-50 text-sky-950 font-bold shadow-sm ring-2 ring-sky-100"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <div className="text-base font-bold">{langItem.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{langItem.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Identification (ABHA or Manual) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t.step1Title}</h2>
              <p className="text-xs text-slate-500">
                Ayushman Bharat Health Account (ABHA) connects your OPD record with the national digital health ecosystem
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              ABDM Milestone 1 Verified
            </span>
          </div>

          {/* ABHA QR & Number Input */}
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-sky-900">
                  {t.abhaScanOrEnter}
                </label>
                <input
                  type="text"
                  value={abhaInput}
                  onChange={(e) => setAbhaInput(e.target.value)}
                  placeholder={t.abhaPlaceholder}
                  className="mt-1 bg-white border border-sky-300 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSimulateAbhaScan}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-sky-300 text-sky-800 hover:bg-sky-100 text-xs font-bold transition-all shadow-xs shrink-0"
            >
              Simulate Scan ABHA Card
            </button>
          </div>

          {/* Demographic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.patientName} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isHi ? "उदा. सुनीता देवी" : "e.g. Sunita Devi"}
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.age} <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 48"
                min={1}
                max={120}
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t.gender}</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-semibold bg-white cursor-pointer"
              >
                <option value="Male">{t.male}</option>
                <option value="Female">{t.female}</option>
                <option value="Other">{t.other}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-semibold"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Village, town, district"
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-semibold"
              />
            </div>
          </div>
        </div>

        {/* DPDP Act 2023 Consent Section (Bilingual Audio + Visual) */}
        <div className="bg-white border-2 border-emerald-300 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Privacy & Consent</h3>
            </div>

            {/* Audio Consent Reader for Low-literacy patients */}
            <button
              type="button"
              onClick={handleSpeakConsent}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isSpeakingConsent
                  ? "bg-amber-500 text-white animate-pulse"
                  : "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{t.dpdpAudioButton}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
            {t.dpdpConsentBody}
          </p>

          <div className="space-y-3 pt-2">
            <label htmlFor="dpdpConsentCheckbox" className="flex items-start gap-3 text-sm font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                id="dpdpConsentCheckbox"
                checked={consentAgreed}
                onChange={(e) => setConsentAgreed(e.target.checked)}
                className="mt-0.5 w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
              <span>I agree to share my information for clinical consultation.</span>
            </label>
            <label htmlFor="dataUseConsentCheckbox" className="flex items-start gap-3 text-sm font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                id="dataUseConsentCheckbox"
                checked={dataUseAgreed}
                onChange={(e) => setDataUseAgreed(e.target.checked)}
                className="mt-0.5 w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
              <span>I understand how my data will be used to prepare my clinical summary.</span>
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
            {[
              "Role-based access",
              "Encrypted session",
              "15-minute timeout",
              "Audit log",
              "Doctor verification",
              "Delete / logout"
            ].map((control) => (
              <div key={control} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-600">
                <ShieldCheck className="inline-block w-3.5 h-3.5 mr-1 text-emerald-600" />
                {control}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-[11px] text-slate-500">
              You can delete this intake session at any time. Doctor access requires verified credentials.
            </p>
            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                clearActiveSession();
                router.push("/");
              }}
              className="shrink-0 rounded-xl border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50"
            >
              Delete session & exit
            </button>
          </div>
        </div>

        {/* Next Step Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleProceed}
            className="flex items-center space-x-2 px-8 py-4 rounded-2xl font-black text-base bg-sky-600 hover:bg-sky-500 text-white shadow-xl shadow-sky-600/30 transition-all transform active:scale-95"
          >
            <span>{t.nextButton}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
         </>
        )}
      </main>
    </div>
  );
}
