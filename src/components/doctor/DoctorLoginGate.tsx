"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Lock,
  Unlock,
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Home,
  UserCheck,
  HeartPulse,
  Leaf,
  Activity,
  UserPlus,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  BadgeCheck,
  Check,
  LogOut,
  Hospital,
  Sparkles
} from "lucide-react";
import { useDoctorAuth } from "@/components/doctor/DoctorAuthContext";
import { DoctorProfile } from "@/lib/kioskStore";

interface DoctorLoginGateProps {
  children: React.ReactNode;
}

export const DoctorLoginGate: React.FC<DoctorLoginGateProps> = ({ children }) => {
  const {
    doctor,
    isAuthenticated,
    isLocked,
    roster,
    loginWithPin,
    unlockSession,
    logout,
    registerDoctor
  } = useDoctorAuth();

  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [loading, setLoading] = useState(false);

  // Locked Screen PIN state
  const [unlockPin, setUnlockPin] = useState("");
  const [unlockError, setUnlockError] = useState("");

  // Registration modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regName, setRegName] = useState("");
  const [regDept, setRegDept] = useState("General Medicine");
  const [regRoom, setRegRoom] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [regDesignation, setRegDesignation] = useState("");
  const [regPin, setRegPin] = useState("");
  const [regError, setRegError] = useState("");

  useEffect(() => {
    if (doctor) {
      setSelectedDoctor(doctor);
    } else if (roster.length > 0 && !selectedDoctor) {
      setSelectedDoctor(roster[0]);
    }
  }, [doctor, roster, selectedDoctor]);

  const handleSelectDoctor = (doc: DoctorProfile) => {
    setSelectedDoctor(doc);
    setPinInput("");
    setErrorMsg("");
  };

  const handlePinSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedDoctor) return;

    if (!pinInput.trim()) {
      setErrorMsg("Please enter your clinical PIN.");
      return;
    }

    setLoading(true);
    const res = await loginWithPin(selectedDoctor.id, pinInput);
    setLoading(false);

    if (res.success) {
      setErrorMsg("");
      setSuccessToast(`Welcome, ${selectedDoctor.name}`);
      setTimeout(() => setSuccessToast(""), 3000);
    } else {
      setErrorMsg(res.error || `Invalid PIN for ${selectedDoctor.name}.`);
      setPinInput("");
    }
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockPin.trim()) {
      setUnlockError("Please enter your PIN to unlock.");
      return;
    }
    const success = unlockSession(unlockPin);
    if (success) {
      setUnlockPin("");
      setUnlockError("");
    } else {
      setUnlockError("Incorrect PIN. Please re-enter.");
      setUnlockPin("");
    }
  };

  const handleKeypadPress = (digit: string) => {
    if (pinInput.length < 8) {
      setPinInput((prev) => prev + digit);
      setErrorMsg("");
    }
  };

  const handleKeypadBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handleKeypadClear = () => {
    setPinInput("");
    setErrorMsg("");
  };

  const handleRegisterNewDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setRegError("Please enter the Doctor's Full Name.");
      return;
    }
    if (!regPin.trim() || regPin.trim().length < 4) {
      setRegError("Please set a secure 4-digit numeric PIN.");
      return;
    }

    const res = await registerDoctor({
      name: regName.trim(),
      department: regDept,
      opdRoom: regRoom.trim() || `OPD Room #${Math.floor(1 + Math.random() * 20)}`,
      regNumber: regNumber.trim() || `MCI-2024-${Math.floor(10000 + Math.random() * 90000)}`,
      designation: regDesignation.trim() || "Attending Consultant",
      passcode: regPin.trim()
    });

    if (res.success && res.doctor) {
      setSelectedDoctor(res.doctor);
      setPinInput("");
      setShowRegisterModal(false);
      setSuccessToast(`Dr. ${res.doctor.name} registered successfully. Enter PIN to authenticate.`);
      setTimeout(() => setSuccessToast(""), 5000);

      // Reset
      setRegName("");
      setRegRoom("");
      setRegNumber("");
      setRegDesignation("");
      setRegPin("");
      setRegError("");
    } else {
      setRegError(res.error || "Registration failed.");
    }
  };

  const getDoctorIcon = (dept: string) => {
    if (dept.includes("Emergency")) return <HeartPulse className="w-5 h-5 text-rose-300" />;
    if (dept.includes("AYUSH")) return <Leaf className="w-5 h-5 text-emerald-300" />;
    if (dept.includes("Endocrinology")) return <Activity className="w-5 h-5 text-purple-300" />;
    if (dept.includes("Pediatrics")) return <Sparkles className="w-5 h-5 text-amber-300" />;
    return <Stethoscope className="w-5 h-5 text-sky-300" />;
  };

  // Case 1: Workstation is locked (session preserved, requires quick PIN unlock)
  if (isAuthenticated && isLocked && doctor) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-600/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider mb-2">
              Workstation Locked (DPDP 2023)
            </div>
            <h2 className="text-xl font-black text-white">{doctor.name}</h2>
            <p className="text-xs text-slate-400 mt-1">
              {doctor.department} • {doctor.opdRoom}
            </p>
          </div>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="block text-xs font-semibold text-slate-300">
                Enter PIN to Resume Consultation
              </label>
              <input
                type="password"
                maxLength={8}
                value={unlockPin}
                onChange={(e) => {
                  setUnlockPin(e.target.value);
                  setUnlockError("");
                }}
                placeholder="Enter 4-digit PIN"
                autoFocus
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-center tracking-widest text-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {unlockError && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{unlockError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Workstation</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center space-x-1.5 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Doctor / Sign Out</span>
            </button>
            <Link href="/doctor/login" className="hover:text-sky-400 transition-colors">
              Full Login Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Already authenticated and unlocked
  if (isAuthenticated && doctor) {
    return <>{children}</>;
  }

  // Case 3: Not authenticated - Display Physician Authentication Gate
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-600/10 blur-3xl rounded-full pointer-events-none" />

      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-900/90 border border-emerald-500/50 text-emerald-100 px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden z-10">
        {/* Top Banner Gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-emerald-500 to-rose-500" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0 shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider mb-1">
                <ShieldAlert className="w-3 h-3" />
                <span>DPDP Act 2023 Doctor Access Gate</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Physician Authentication Portal
              </h2>
              <p className="text-xs text-slate-400">
                Mandatory authentication for all medical officers to access assigned OPD patient care records.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowRegisterModal(true)}
            className="self-start sm:self-auto inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 border border-slate-700 transition-all text-xs font-bold shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Register New Doctor</span>
          </button>
        </div>

        {/* 2-Column Grid: Left Roster List, Right PIN Auth Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left Column: Doctor Selection (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>Step 1: Select Your Doctor Profile</span>
              <span className="text-sky-400 font-normal">{roster.length} Medical Officers on Roster</span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {roster.map((doc) => {
                const isSelected = selectedDoctor?.id === doc.id;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => handleSelectDoctor(doc)}
                    className={`w-full p-3.5 rounded-2xl text-left border-2 transition-all flex items-start space-x-3.5 group relative ${
                      isSelected
                        ? "border-sky-500 bg-sky-950/30 shadow-lg ring-2 ring-sky-500/20"
                        : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-850"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow ${doc.avatarColor} text-white`}
                    >
                      {getDoctorIcon(doc.department)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm truncate group-hover:text-sky-300 transition-colors">
                          {doc.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          {doc.opdRoom}
                        </span>
                      </div>
                      <div className="text-xs text-sky-400 font-semibold truncate mt-0.5">
                        {doc.department}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5 flex items-center space-x-2">
                        <span>{doc.designation}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px] text-slate-500">{doc.regNumber}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: PIN Verification Box (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            {selectedDoctor ? (
              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Step 2: Enter Doctor PIN
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 ${selectedDoctor.avatarColor}`}
                    >
                      {getDoctorIcon(selectedDoctor.department)}
                    </div>
                    <div className="font-bold text-white text-sm truncate">
                      {selectedDoctor.name}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {selectedDoctor.department} ({selectedDoctor.opdRoom})
                  </div>
                </div>

                {/* Demo PIN Hint Badge */}
                <div className="p-2.5 rounded-xl bg-sky-950/50 border border-sky-800/50 flex items-center space-x-2 text-xs">
                  <KeyRound className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-slate-300">
                    Authorized Demo PIN:{" "}
                    <code className="font-mono font-bold text-sky-300 px-1 py-0.5 bg-sky-900/50 rounded">
                      {selectedDoctor.passcode}
                    </code>
                  </span>
                </div>

                {/* PIN Input Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Clinical PIN / Passcode
                  </label>
                  <div className="relative">
                    <input
                      type={showPin ? "text" : "password"}
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value);
                        setErrorMsg("");
                      }}
                      placeholder="Enter 4-digit PIN"
                      maxLength={8}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-center tracking-widest text-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      tabIndex={-1}
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* On-Screen Touch Numpad */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((btn) => (
                    <button
                      key={btn}
                      type="button"
                      onClick={() => {
                        if (btn === "C") handleKeypadClear();
                        else if (btn === "⌫") handleKeypadBackspace();
                        else handleKeypadPress(btn);
                      }}
                      className={`h-9 rounded-lg font-bold text-sm transition-all ${
                        btn === "C"
                          ? "bg-slate-800 text-rose-400 hover:bg-rose-950/40 hover:text-rose-300"
                          : btn === "⌫"
                          ? "bg-slate-800 text-amber-400 hover:bg-amber-950/40 hover:text-amber-300"
                          : "bg-slate-850 hover:bg-slate-750 text-slate-200 active:scale-95"
                      }`}
                    >
                      {btn}
                    </button>
                  ))}
                </div>

                {/* Error Message */}
                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start space-x-2 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Verify PIN & Access Desk</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Select a doctor from the roster to begin authentication.
              </div>
            )}
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 hover:text-slate-300 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to MediKiosk Home</span>
          </Link>
          <span className="text-[11px] text-slate-600">
            Smart India Hackathon • Digital Personal Data Protection Act 2023 Compliant
          </span>
        </div>
      </div>

      {/* Register New Doctor Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Register New Medical Officer</h3>
                  <p className="text-[11px] text-slate-400">Add a new doctor with distinct credentials & OPD queue</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterNewDoctor} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Doctor Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sunita Rao"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Department *
                  </label>
                  <select
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Emergency & Resuscitation">Emergency & Resuscitation</option>
                    <option value="AYUSH / Kayachikitsa & Panchakarma">AYUSH / Kayachikitsa</option>
                    <option value="Endocrinology & Diabetology">Endocrinology & Diabetology</option>
                    <option value="Pediatrics & Neonatology">Pediatrics & Neonatology</option>
                    <option value="Cardiology & Chest Clinic">Cardiology & Chest Clinic</option>
                    <option value="Orthopedics & Trauma">Orthopedics & Trauma</option>
                    <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="ENT & Head Neck">ENT & Head Neck</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    OPD Room / Bay *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room #9 or Bay #2"
                    value={regRoom}
                    onChange={(e) => setRegRoom(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Medical Reg. Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MCI-2021-98765"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Consultant Pediatrician"
                    value={regDesignation}
                    onChange={(e) => setRegDesignation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assign 4-Digit Clinical PIN *
                </label>
                <input
                  type="password"
                  required
                  maxLength={8}
                  placeholder="e.g. 5566"
                  value={regPin}
                  onChange={(e) => setRegPin(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-center tracking-widest text-base focus:outline-none focus:border-sky-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  This PIN will be required whenever this physician logs in or unlocks the desk.
                </p>
              </div>

              {regError && (
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs">
                  {regError}
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md"
                >
                  Save & Register Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
