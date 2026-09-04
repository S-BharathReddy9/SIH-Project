"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ShieldCheck,
  Stethoscope,
  RefreshCw,
  Printer,
  ArrowLeft,
  LogOut,
  Lock,
  Unlock,
  UserCheck,
  ChevronDown,
  HeartPulse,
  Leaf,
  KeyRound,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  History,
  BadgeCheck,
  Sparkles,
  Hospital
} from "lucide-react";
import { useDoctorAuth } from "@/components/doctor/DoctorAuthContext";
import { DoctorProfile } from "@/lib/kioskStore";

interface DoctorHeaderProps {
  emergencyCount: number;
  urgentCount: number;
  routineCount: number;
  onRefresh?: () => void;
  showBackToQueue?: boolean;
  onDoctorSwitched?: (doc: DoctorProfile) => void;
}

export const DoctorHeader: React.FC<DoctorHeaderProps> = ({
  emergencyCount,
  urgentCount,
  routineCount,
  onRefresh,
  showBackToQueue = false,
  onDoctorSwitched
}) => {
  const router = useRouter();
  const {
    doctor: activeDoctor,
    roster,
    lockSession,
    logout,
    switchDoctor,
    auditLogs
  } = useDoctorAuth();

  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  // PIN challenge state for switching doctors
  const [switchTarget, setSwitchTarget] = useState<DoctorProfile | null>(null);
  const [switchPin, setSwitchPin] = useState("");
  const [switchError, setSwitchError] = useState("");
  const [showSwitchPin, setShowSwitchPin] = useState(false);

  const handleRequestSwitch = (doc: DoctorProfile) => {
    if (activeDoctor && doc.id === activeDoctor.id) {
      setShowDoctorDropdown(false);
      return;
    }
    setSwitchTarget(doc);
    setSwitchPin("");
    setSwitchError("");
    setShowSwitchPin(false);
    setShowDoctorDropdown(false);
  };

  const handleConfirmSwitch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!switchTarget) return;

    if (!switchPin.trim()) {
      setSwitchError("Please enter the PIN for " + switchTarget.name);
      return;
    }

    const success = switchDoctor(switchTarget.id, switchPin);
    if (success) {
      const switched = switchTarget;
      setSwitchTarget(null);
      setSwitchPin("");
      setSwitchError("");
      if (onDoctorSwitched) {
        onDoctorSwitched(switched);
      }
    } else {
      setSwitchError(`Invalid PIN for ${switchTarget.name}.`);
      setSwitchPin("");
    }
  };

  const handleCancelSwitch = () => {
    setSwitchTarget(null);
    setSwitchPin("");
    setSwitchError("");
  };

  const handleLockDesk = () => {
    lockSession();
  };

  const handleSignOut = () => {
    logout();
    router.push("/doctor/login");
  };

  const getDepartmentIcon = (dept: string) => {
    if (dept.includes("Emergency")) return <HeartPulse className="w-4 h-4 text-rose-400" />;
    if (dept.includes("AYUSH")) return <Leaf className="w-4 h-4 text-emerald-400" />;
    if (dept.includes("Endocrinology")) return <Activity className="w-4 h-4 text-purple-400" />;
    if (dept.includes("Pediatrics")) return <Sparkles className="w-4 h-4 text-amber-400" />;
    if (dept.includes("Cardiology")) return <HeartPulse className="w-4 h-4 text-red-400" />;
    if (dept.includes("Admin") || dept.includes("CMO")) return <Hospital className="w-4 h-4 text-slate-300" />;
    return <Stethoscope className="w-4 h-4 text-sky-400" />;
  };

  if (!activeDoctor) return null;

  return (
    <>
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Left: Brand & Doctor Profile Switcher */}
          <div className="flex items-center space-x-3">
            {showBackToQueue && (
              <Link
                href="/doctor"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors mr-1"
                title="Back to OPD Patient Queue"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}

            <div className="relative">
              {/* Active Doctor Card with Dropdown Switcher */}
              <button
                onClick={() => setShowDoctorDropdown(!showDoctorDropdown)}
                className="flex items-center space-x-3 p-1.5 pr-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all text-left group"
                title="Click to Switch Doctor Account"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${activeDoctor.avatarColor}`}
                >
                  {getDepartmentIcon(activeDoctor.department)}
                </div>

                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-black text-white group-hover:text-sky-400 transition-colors">
                      {activeDoctor.name}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-700 text-sky-300 border border-slate-600">
                      {activeDoctor.badgeTag}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                    <span>{activeDoctor.department}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{activeDoctor.opdRoom}</span>
                  </div>
                </div>
              </button>

              {/* Doctor Switcher Dropdown Menu */}
              {showDoctorDropdown && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 flex items-center justify-between">
                    <span>Switch Doctor Account (PIN Required):</span>
                    <span className="text-emerald-400 font-normal">Active Session</span>
                  </div>

                  <div className="space-y-1 mt-1 max-h-64 overflow-y-auto">
                    {roster.map((doc) => {
                      const isCurrent = doc.id === activeDoctor.id;
                      return (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => handleRequestSwitch(doc)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center space-x-2.5 transition-colors ${
                            isCurrent
                              ? "bg-sky-600/20 text-white border border-sky-500/40 font-bold"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 ${doc.avatarColor}`}
                          >
                            {getDepartmentIcon(doc.department)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold truncate">{doc.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {doc.department} • {doc.opdRoom}
                            </div>
                          </div>
                          {isCurrent && <span className="text-sky-400 text-xs font-bold">✓</span>}
                          {!isCurrent && <Lock className="w-3.5 h-3.5 text-slate-500" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-2 border-t border-slate-800 mt-1 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDoctorDropdown(false);
                        setShowAuditModal(true);
                      }}
                      className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center space-x-1"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Audit Trail</span>
                    </button>
                    <Link
                      href="/doctor/login"
                      className="text-[11px] text-slate-400 hover:text-white"
                    >
                      Login Portal ↗
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Live Triage Metrics & Controls */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Triage Count Badges */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <span className="text-slate-400 font-medium">OPD Live Queue:</span>
              {emergencyCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold animate-pulse">
                  {emergencyCount} Emergency
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                {urgentCount} Urgent
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-semibold">
                {routineCount} Routine
              </span>
            </div>

            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Refresh OPD Queue"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* Audit Log Button */}
            <button
              onClick={() => setShowAuditModal(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="View DPDP Access Audit Trail"
            >
              <History className="w-4 h-4" />
            </button>

            {/* Lock Desk Button */}
            <button
              onClick={handleLockDesk}
              className="flex items-center space-x-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-slate-800 hover:bg-amber-950/40 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-800 transition-all"
              title="Lock Workstation Desk (Quick PIN Unlock)"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Lock Desk</span>
            </button>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800 transition-all"
              title="Sign Out of Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* PIN Challenge Modal for Doctor Switching */}
      {switchTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${switchTarget.avatarColor}`}
                >
                  {getDepartmentIcon(switchTarget.department)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    Switch to {switchTarget.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {switchTarget.department} • {switchTarget.opdRoom}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancelSwitch}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs flex items-center space-x-2">
              <KeyRound className="w-4 h-4 shrink-0" />
              <span>
                Enter <strong>{switchTarget.name}</strong>&apos;s PIN to authenticate handover.
              </span>
            </div>

            <form onSubmit={handleConfirmSwitch} className="space-y-3">
              <div className="relative">
                <input
                  type={showSwitchPin ? "text" : "password"}
                  value={switchPin}
                  onChange={(e) => {
                    setSwitchPin(e.target.value);
                    setSwitchError("");
                  }}
                  placeholder="Enter 4-digit PIN"
                  maxLength={8}
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-center tracking-widest text-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowSwitchPin(!showSwitchPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  tabIndex={-1}
                >
                  {showSwitchPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {switchError && (
                <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{switchError}</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleCancelSwitch}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Verify & Switch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DPDP Act 2023 Audit Trail Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">DPDP Clinical Access Audit Trail</h3>
                  <p className="text-[11px] text-slate-400">Section 8 DPDP Act 2023 Immutable Workstation Logs</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {auditLogs.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No access events logged yet in current session.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start justify-between text-xs gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{log.doctorName}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            log.action === "LOGIN"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : log.action === "LOGOUT"
                              ? "bg-rose-500/20 text-rose-300"
                              : log.action === "LOCK_DESK"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-sky-500/20 text-sky-300"
                          }`}
                        >
                          {log.action}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{log.details || "Session action"}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
