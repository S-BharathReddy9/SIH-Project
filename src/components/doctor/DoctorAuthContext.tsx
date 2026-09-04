"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  DoctorProfile,
  DoctorAuthAuditLog,
  getDoctorRoster,
  getCurrentDoctor,
  setCurrentDoctor,
  authenticateDoctor,
  authenticateDoctorByCredentials,
  registerDoctor as storeRegisterDoctor,
  lockDoctorSession as storeLockSession,
  isDoctorSessionLocked as storeIsLocked,
  unlockDoctorSession as storeUnlockSession,
  logoutDoctor as storeLogoutDoctor,
  getDoctorAuditLogs
} from "@/lib/kioskStore";

interface DoctorAuthContextType {
  doctor: DoctorProfile | null;
  isAuthenticated: boolean;
  isLocked: boolean;
  roster: DoctorProfile[];
  auditLogs: DoctorAuthAuditLog[];
  loginWithCredentials: (identifier: string, passcode: string) => Promise<{ success: boolean; error?: string }>;
  loginWithPin: (doctorId: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  registerDoctor: (data: any) => Promise<{ success: boolean; doctor?: DoctorProfile; error?: string }>;
  logout: () => void;
  lockSession: () => void;
  unlockSession: (pin: string) => boolean;
  switchDoctor: (targetDoctorId: string, pin: string) => boolean;
  refreshRoster: () => void;
}

const DoctorAuthContext = createContext<DoctorAuthContextType | undefined>(undefined);

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes of inactivity before auto-lock

export const DoctorAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [roster, setRoster] = useState<DoctorProfile[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [auditLogs, setAuditLogs] = useState<DoctorAuthAuditLog[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshRoster = useCallback(() => {
    const list = getDoctorRoster();
    setRoster(list);
    setAuditLogs(getDoctorAuditLogs());
  }, []);

  useEffect(() => {
    const current = getCurrentDoctor();
    setDoctor(current);
    setIsLocked(storeIsLocked());
    refreshRoster();
    setIsInitialized(true);
  }, [refreshRoster]);

  // Inactivity auto-lock timer
  useEffect(() => {
    if (!doctor || isLocked) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        storeLockSession();
        setIsLocked(true);
      }, IDLE_TIMEOUT_MS);
    };

    resetTimer();

    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];
    activityEvents.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }));

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [doctor, isLocked]);

  const loginWithCredentials = async (identifier: string, passcode: string) => {
    const res = authenticateDoctorByCredentials(identifier, passcode);
    if (res.success && res.doctor) {
      setDoctor(res.doctor);
      setIsLocked(false);
      refreshRoster();
      return { success: true };
    }
    return { success: false, error: res.error || "Authentication failed." };
  };

  const loginWithPin = async (doctorId: string, pin: string) => {
    const res = authenticateDoctor(doctorId, pin);
    if (res.success && res.doctor) {
      setDoctor(res.doctor);
      setIsLocked(false);
      refreshRoster();
      return { success: true };
    }
    return { success: false, error: res.error || "Invalid PIN entered." };
  };

  const registerDoctor = async (data: any) => {
    try {
      const newDoc = storeRegisterDoctor(data);
      refreshRoster();
      return { success: true, doctor: newDoc };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to register physician." };
    }
  };

  const logout = () => {
    storeLogoutDoctor();
    setDoctor(null);
    setIsLocked(false);
    refreshRoster();
  };

  const lockSession = () => {
    storeLockSession();
    setIsLocked(true);
    setAuditLogs(getDoctorAuditLogs());
  };

  const unlockSession = (pin: string) => {
    const success = storeUnlockSession(pin);
    if (success) {
      setIsLocked(false);
      setAuditLogs(getDoctorAuditLogs());
      return true;
    }
    return false;
  };

  const switchDoctor = (targetDoctorId: string, pin: string) => {
    const res = authenticateDoctor(targetDoctorId, pin);
    if (res.success && res.doctor) {
      setDoctor(res.doctor);
      setIsLocked(false);
      refreshRoster();
      return true;
    }
    return false;
  };

  const value: DoctorAuthContextType = {
    doctor,
    isAuthenticated: !!doctor,
    isLocked,
    roster,
    auditLogs,
    loginWithCredentials,
    loginWithPin,
    registerDoctor,
    logout,
    lockSession,
    unlockSession,
    switchDoctor,
    refreshRoster
  };

  return (
    <DoctorAuthContext.Provider value={value}>
      {children}
    </DoctorAuthContext.Provider>
  );
};

export function useDoctorAuth() {
  const context = useContext(DoctorAuthContext);
  if (!context) {
    throw new Error("useDoctorAuth must be used within a DoctorAuthProvider");
  }
  return context;
}
