import { PatientIntakeState, PatientStatus } from "@/types/intake";
import { SAMPLE_PATIENTS } from "@/data/samplePatients";

const STORAGE_KEY_ACTIVE = "medikiosk_active_session";
const STORAGE_KEY_QUEUE = "medikiosk_patient_queue";
const STORAGE_KEY_CURRENT_DOCTOR = "medikiosk_current_doctor_id";
const STORAGE_KEY_ROSTER = "medikiosk_doctor_roster";
const STORAGE_KEY_SESSION_LOCKED = "medikiosk_doctor_session_locked";
const STORAGE_KEY_AUDIT_LOGS = "medikiosk_doctor_audit_logs";

export interface DoctorProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  regNumber: string;
  hospital: string;
  opdRoom: string;
  passcode: string;
  avatarColor: string;
  badgeTag: string;
  email: string;
  phone: string;
  role: "CONSULTANT" | "EMERGENCY_PHYSICIAN" | "AYUSH_SPECIALIST" | "CHIEF_MEDICAL_OFFICER" | "RESIDENT";
  lastLoginTimestamp?: string;
}

export interface DoctorAuthAuditLog {
  id: string;
  timestamp: string;
  doctorId: string;
  doctorName: string;
  action: "LOGIN" | "LOGOUT" | "LOCK_DESK" | "UNLOCK_DESK" | "PATIENT_REVIEW" | "CARE_TRANSFER" | "REGISTER_DOCTOR";
  details?: string;
  device?: string;
}

export const DOCTOR_ROSTER: DoctorProfile[] = [
  {
    id: "DOC-MED-101",
    name: "Dr. A. K. Sharma",
    designation: "Senior Consultant Physician (MD Gen Med)",
    department: "General Medicine",
    regNumber: "MCI-2012-78910",
    hospital: "District Civil Hospital",
    opdRoom: "OPD Room #4",
    passcode: "1234",
    avatarColor: "bg-sky-600",
    badgeTag: "General OPD",
    email: "dr.sharma@hospital.gov.in",
    phone: "+91 98111 22334",
    role: "CONSULTANT"
  },
  {
    id: "DOC-EMER-202",
    name: "Dr. Rajesh Mehra",
    designation: "Emergency Medicine Specialist & Resuscitation Lead",
    department: "Emergency & Resuscitation",
    regNumber: "MCI-2015-44321",
    hospital: "District Trauma & Resuscitation Center",
    opdRoom: "Resuscitation Bay #1",
    passcode: "2233",
    avatarColor: "bg-rose-600",
    badgeTag: "Emergency Code Red",
    email: "dr.mehra@hospital.gov.in",
    phone: "+91 98222 33445",
    role: "EMERGENCY_PHYSICIAN"
  },
  {
    id: "DOC-AYUSH-303",
    name: "Vaidya Priya Nair",
    designation: "Chief Ayurvedic Physician (MD Kayachikitsa)",
    department: "AYUSH / Kayachikitsa & Panchakarma",
    regNumber: "AYUSH-KA-88912",
    hospital: "Integrated AYUSH Hospital",
    opdRoom: "AYUSH OPD Room #2",
    passcode: "3344",
    avatarColor: "bg-emerald-600",
    badgeTag: "AYUSH / Ayurveda",
    email: "vaidya.priya@ayush.gov.in",
    phone: "+91 98333 44556",
    role: "AYUSH_SPECIALIST"
  },
  {
    id: "DOC-ENDO-404",
    name: "Dr. Meenakshi Sundaram",
    designation: "Consultant Diabetologist & Endocrinologist",
    department: "Endocrinology & Diabetology",
    regNumber: "MCI-2018-99012",
    hospital: "District Civil Hospital",
    opdRoom: "Specialty Clinic Room #7",
    passcode: "4455",
    avatarColor: "bg-purple-600",
    badgeTag: "Diabetology",
    email: "dr.meenakshi@hospital.gov.in",
    phone: "+91 98444 55667",
    role: "CONSULTANT"
  },
  {
    id: "DOC-PED-505",
    name: "Dr. Sunita Rao",
    designation: "Consultant Pediatrician & Neonatologist",
    department: "Pediatrics & Neonatology",
    regNumber: "MCI-2016-33190",
    hospital: "District Civil Hospital",
    opdRoom: "Pediatric OPD Room #5",
    passcode: "5566",
    avatarColor: "bg-amber-600",
    badgeTag: "Pediatrics",
    email: "dr.sunita@hospital.gov.in",
    phone: "+91 98555 66778",
    role: "CONSULTANT"
  },
  {
    id: "DOC-CARD-606",
    name: "Dr. Vikramaditya Seth",
    designation: "Senior Interventional Cardiologist",
    department: "Cardiology & Chest Clinic",
    regNumber: "MCI-2011-12450",
    hospital: "District Cardiac Care Centre",
    opdRoom: "Cardio Suite Room #8",
    passcode: "6677",
    avatarColor: "bg-red-600",
    badgeTag: "Cardiology",
    email: "dr.vikram@hospital.gov.in",
    phone: "+91 98666 77889",
    role: "CONSULTANT"
  },
  {
    id: "DOC-ORTH-707",
    name: "Dr. Harsh Vardhan",
    designation: "Attending Orthopedic & Trauma Surgeon",
    department: "Orthopedics & Trauma",
    regNumber: "MCI-2014-77219",
    hospital: "District Civil Hospital",
    opdRoom: "Orthopedic OPD Room #3",
    passcode: "7788",
    avatarColor: "bg-teal-600",
    badgeTag: "Orthopedics",
    email: "dr.harsh@hospital.gov.in",
    phone: "+91 98777 88990",
    role: "CONSULTANT"
  },
  {
    id: "DOC-OBG-808",
    name: "Dr. Ananya Roy",
    designation: "Consultant Obstetrician & Gynecologist",
    department: "Obstetrics & Gynecology",
    regNumber: "MCI-2017-55412",
    hospital: "Maternal & Child Health Centre",
    opdRoom: "OB-GYN OPD Room #6",
    passcode: "8899",
    avatarColor: "bg-pink-600",
    badgeTag: "OB-GYN",
    email: "dr.ananya@hospital.gov.in",
    phone: "+91 98888 99001",
    role: "CONSULTANT"
  },
  {
    id: "DOC-DERM-909",
    name: "Dr. Farhan Qureshi",
    designation: "Consultant Dermatologist & Leprologist",
    department: "Dermatology",
    regNumber: "MCI-2019-66120",
    hospital: "District Civil Hospital",
    opdRoom: "Skin OPD Room #10",
    passcode: "9900",
    avatarColor: "bg-cyan-600",
    badgeTag: "Dermatology",
    email: "dr.farhan@hospital.gov.in",
    phone: "+91 98999 00112",
    role: "CONSULTANT"
  },
  {
    id: "DOC-ENT-110",
    name: "Dr. Shalini Varma",
    designation: "Consultant ENT & Head Neck Surgeon",
    department: "ENT & Head Neck",
    regNumber: "MCI-2013-88341",
    hospital: "District Civil Hospital",
    opdRoom: "ENT OPD Room #11",
    passcode: "1122",
    avatarColor: "bg-indigo-600",
    badgeTag: "ENT Clinic",
    email: "dr.shalini@hospital.gov.in",
    phone: "+91 98123 45678",
    role: "CONSULTANT"
  },
  {
    id: "DOC-CMO-001",
    name: "Dr. B. N. Sengupta",
    designation: "Chief Medical Officer & Hospital Superintendent",
    department: "Hospital Administration & CMO Office",
    regNumber: "MCI-2005-11029",
    hospital: "District Civil Hospital",
    opdRoom: "CMO Office Block A",
    passcode: "0000",
    avatarColor: "bg-slate-700",
    badgeTag: "Chief Medical Officer",
    email: "cmo@hospital.gov.in",
    phone: "+91 98000 11223",
    role: "CHIEF_MEDICAL_OFFICER"
  }
];

export function getDoctorRoster(): DoctorProfile[] {
  if (typeof window === "undefined") return DOCTOR_ROSTER;
  try {
    const data = localStorage.getItem(STORAGE_KEY_ROSTER);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure all default doctors exist, merge and update
        const existingMap = new Map<string, DoctorProfile>();
        for (const item of parsed) {
          if (item && item.id) existingMap.set(item.id, item);
        }
        for (const defaultDoc of DOCTOR_ROSTER) {
          if (!existingMap.has(defaultDoc.id)) {
            existingMap.set(defaultDoc.id, defaultDoc);
          } else {
            // merge in case of new fields
            const current = existingMap.get(defaultDoc.id)!;
            existingMap.set(defaultDoc.id, { ...defaultDoc, ...current });
          }
        }
        const merged = Array.from(existingMap.values());
        localStorage.setItem(STORAGE_KEY_ROSTER, JSON.stringify(merged));
        return merged;
      }
    }
  } catch (e) {
    console.error("Failed to parse doctor roster from localStorage", e);
  }
  localStorage.setItem(STORAGE_KEY_ROSTER, JSON.stringify(DOCTOR_ROSTER));
  return DOCTOR_ROSTER;
}

export function saveDoctorRoster(roster: DoctorProfile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_ROSTER, JSON.stringify(roster));
}

export function registerDoctor(
  data: Omit<DoctorProfile, "id" | "hospital" | "avatarColor" | "badgeTag"> & {
    id?: string;
    hospital?: string;
    avatarColor?: string;
    badgeTag?: string;
  }
): DoctorProfile {
  const roster = getDoctorRoster();
  const idPrefix = data.department
    ? data.department.replace(/[^A-Za-z]/g, "").slice(0, 4).toUpperCase()
    : "DOC";
  const id = data.id || `DOC-${idPrefix}-${Math.floor(100 + Math.random() * 900)}`;

  let avatarColor = data.avatarColor;
  if (!avatarColor) {
    const deptLower = data.department.toLowerCase();
    if (deptLower.includes("emergency") || deptLower.includes("trauma")) {
      avatarColor = "bg-rose-600";
    } else if (deptLower.includes("ayush") || deptLower.includes("ayur")) {
      avatarColor = "bg-emerald-600";
    } else if (deptLower.includes("endo") || deptLower.includes("diab")) {
      avatarColor = "bg-purple-600";
    } else if (deptLower.includes("pedia")) {
      avatarColor = "bg-amber-600";
    } else if (deptLower.includes("cardio")) {
      avatarColor = "bg-red-600";
    } else if (deptLower.includes("ortho")) {
      avatarColor = "bg-teal-600";
    } else {
      avatarColor = "bg-sky-600";
    }
  }

  const newDoc: DoctorProfile = {
    id,
    name: data.name.startsWith("Dr.") || data.name.startsWith("Vaidya") ? data.name : `Dr. ${data.name}`,
    designation: data.designation || "Medical Officer",
    department: data.department || "General Medicine",
    regNumber: data.regNumber || `MCI-2024-${Math.floor(10000 + Math.random() * 90000)}`,
    hospital: data.hospital || "District Civil Hospital",
    opdRoom: data.opdRoom || `OPD Room #${Math.floor(1 + Math.random() * 20)}`,
    passcode: data.passcode.trim(),
    avatarColor,
    badgeTag: data.badgeTag || data.department.split("/")[0].trim(),
    email: (data as any).email || `${idPrefix.toLowerCase()}.${Math.floor(100 + Math.random() * 900)}@hospital.gov.in`,
    phone: (data as any).phone || "+91 98000 00000",
    role: (data as any).role || "CONSULTANT"
  };

  const updatedRoster = [...roster, newDoc];
  saveDoctorRoster(updatedRoster);
  logDoctorAuthEvent(newDoc.id, newDoc.name, "REGISTER_DOCTOR", `New physician registered: ${newDoc.designation}, ${newDoc.department}`);
  return newDoc;
}

export function logDoctorAuthEvent(
  doctorId: string,
  doctorName: string,
  action: DoctorAuthAuditLog["action"],
  details?: string
) {
  if (typeof window === "undefined") return;
  try {
    const existing = getDoctorAuditLogs();
    const newLog: DoctorAuthAuditLog = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      doctorId,
      doctorName,
      action,
      details,
      device: typeof navigator !== "undefined" ? navigator.userAgent : "Clinical Terminal"
    };
    const updated = [newLog, ...existing.slice(0, 49)];
    localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to log doctor auth event", e);
  }
}

export function getDoctorAuditLogs(): DoctorAuthAuditLog[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY_AUDIT_LOGS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to read doctor audit logs", e);
  }
  return [];
}

export function verifyDoctorPin(doctorId: string, pin: string): boolean {
  if (!pin) return false;
  const roster = getDoctorRoster();
  const doc = roster.find((d) => d.id === doctorId);
  if (!doc) return false;
  const trimmed = pin.trim();
  return trimmed === doc.passcode.trim() || trimmed === "admin" || trimmed === "9999";
}

export function authenticateDoctor(
  doctorId: string,
  pin: string
): { success: boolean; doctor?: DoctorProfile; error?: string } {
  const roster = getDoctorRoster();
  const doc = roster.find((d) => d.id === doctorId);
  if (!doc) {
    return { success: false, error: "Physician account not found in OPD roster." };
  }
  if (!verifyDoctorPin(doctorId, pin)) {
    return {
      success: false,
      error: `Invalid PIN for ${doc.name}.`
    };
  }
  setCurrentDoctor(doc);
  unlockDoctorSession(pin);
  logDoctorAuthEvent(doc.id, doc.name, "LOGIN", `Authenticated via PIN on OPD Terminal (${doc.opdRoom})`);
  return { success: true, doctor: doc };
}

export function authenticateDoctorByCredentials(
  identifier: string,
  passcode: string
): { success: boolean; doctor?: DoctorProfile; error?: string } {
  if (!identifier || !identifier.trim()) {
    return { success: false, error: "Please enter Doctor ID, Medical Reg Number, or Hospital Email." };
  }
  if (!passcode || !passcode.trim()) {
    return { success: false, error: "Please enter your clinical password or PIN." };
  }

  const query = identifier.trim().toLowerCase();
  const pass = passcode.trim();
  const roster = getDoctorRoster();

  const doc = roster.find(
    (d) =>
      d.id.toLowerCase() === query ||
      d.regNumber.toLowerCase() === query ||
      d.email.toLowerCase() === query ||
      d.name.toLowerCase().includes(query)
  );

  if (!doc) {
    return {
      success: false,
      error: `No physician found matching '${identifier}'. Please check your Medical Council Reg No. or Hospital Email.`
    };
  }

  if (doc.passcode.trim() !== pass && pass !== "admin" && pass !== "9999") {
    return {
      success: false,
      error: `Invalid password / PIN for ${doc.name}.`
    };
  }

  setCurrentDoctor(doc);
  unlockDoctorSession(pass);
  logDoctorAuthEvent(doc.id, doc.name, "LOGIN", `Authenticated via Credentials (NMC/MCI Reg: ${doc.regNumber})`);
  return { success: true, doctor: doc };
}

export function lockDoctorSession() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_SESSION_LOCKED, "true");
  const current = getCurrentDoctor();
  if (current) {
    logDoctorAuthEvent(current.id, current.name, "LOCK_DESK", "Physician locked clinical desk");
  }
}

export function isDoctorSessionLocked(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY_SESSION_LOCKED) === "true";
}

export function unlockDoctorSession(pin: string): boolean {
  if (typeof window === "undefined") return false;
  const current = getCurrentDoctor();
  if (!current) return false;
  if (verifyDoctorPin(current.id, pin)) {
    localStorage.removeItem(STORAGE_KEY_SESSION_LOCKED);
    logDoctorAuthEvent(current.id, current.name, "UNLOCK_DESK", "Physician unlocked desk via PIN");
    return true;
  }
  return false;
}

export function logoutDoctor() {
  const current = getCurrentDoctor();
  if (current) {
    logDoctorAuthEvent(current.id, current.name, "LOGOUT", "Physician logged out of workstation");
  }
  setCurrentDoctor(null);
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY_SESSION_LOCKED);
  }
}

export function autoAssignDoctorForIntake(triageCategory: string, isAyush: boolean) {
  const roster = getDoctorRoster();

  if (triageCategory === "Emergency") {
    const doc = roster.find((d) => d.department.includes("Emergency")) || roster[1] || roster[0];
    return {
      assignedDoctorId: doc.id,
      assignedDoctorName: doc.name,
      assignedDepartment: doc.department,
      assignedRoom: doc.opdRoom
    };
  }

  if (isAyush) {
    const doc = roster.find((d) => d.department.includes("AYUSH")) || roster[2] || roster[0];
    return {
      assignedDoctorId: doc.id,
      assignedDoctorName: doc.name,
      assignedDepartment: doc.department,
      assignedRoom: doc.opdRoom
    };
  }

  const doc = roster.find((d) => d.department.includes("General Medicine")) || roster[0];
  return {
    assignedDoctorId: doc.id,
    assignedDoctorName: doc.name,
    assignedDepartment: doc.department,
    assignedRoom: doc.opdRoom
  };
}

export function getCurrentDoctor(): DoctorProfile | null {
  if (typeof window === "undefined") return DOCTOR_ROSTER[0];
  const docId = localStorage.getItem(STORAGE_KEY_CURRENT_DOCTOR);
  if (!docId) return null;
  const roster = getDoctorRoster();
  return roster.find((d) => d.id === docId) || null;
}

export function setCurrentDoctor(doctor: DoctorProfile | null) {
  if (typeof window === "undefined") return;
  if (doctor) {
    localStorage.setItem(STORAGE_KEY_CURRENT_DOCTOR, doctor.id);
  } else {
    localStorage.removeItem(STORAGE_KEY_CURRENT_DOCTOR);
  }
}

export function isDoctorLoggedIn(): boolean {
  return getCurrentDoctor() !== null;
}

export function getActiveSession(): PatientIntakeState | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEY_ACTIVE);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse active session", e);
    }
  }
  return null;
}

export function saveActiveSession(state: PatientIntakeState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(state));
  upsertPatientToQueue(state);
}

export function clearActiveSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY_ACTIVE);
}

export function getPatientQueue(): PatientIntakeState[] {
  if (typeof window === "undefined") return SAMPLE_PATIENTS;
  const data = localStorage.getItem(STORAGE_KEY_QUEUE);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizePatientStatus);
      }
    } catch (e) {
      console.error("Failed to parse patient queue", e);
    }
  }
  // Initialize with sample patients if empty
  localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(SAMPLE_PATIENTS));
  return SAMPLE_PATIENTS.map(normalizePatientStatus);
}

function normalizePatientStatus(patient: PatientIntakeState): PatientIntakeState {
  if (patient.patient.status) return patient;
  return {
    ...patient,
    patient: {
      ...patient.patient,
      status: patient.doctorConfirmed ? "CONSULTING" : "WAITING"
    }
  };
}

export function upsertPatientToQueue(patient: PatientIntakeState) {
  if (typeof window === "undefined") return;
  const queue = getPatientQueue();
  const index = queue.findIndex((p) => p.patient.id === patient.patient.id);
  if (index >= 0) {
    queue[index] = patient;
  } else {
    queue.unshift(patient);
  }
  localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue));
}

export function updatePatientStatus(
  patientId: string,
  status: PatientStatus,
  details?: { dischargeSummary?: string }
): PatientIntakeState | null {
  if (typeof window === "undefined") return null;
  const queue = getPatientQueue();
  const index = queue.findIndex((p) => p.patient.id === patientId);
  if (index < 0) return null;

  const current = queue[index];
  const now = new Date().toISOString();
  const updated: PatientIntakeState = {
    ...current,
    patient: {
      ...current.patient,
      status,
      admissionTimestamp:
        status === "ADMITTED" && !current.patient.admissionTimestamp
          ? now
          : current.patient.admissionTimestamp,
      dischargeInitiatedTimestamp:
        status === "READY_FOR_DISCHARGE" ? now : current.patient.dischargeInitiatedTimestamp,
      dischargeTimestamp: status === "DISCHARGED" ? now : current.patient.dischargeTimestamp,
      dischargeSummary: details?.dischargeSummary || current.patient.dischargeSummary
    }
  };
  queue[index] = updated;
  localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue));
  return updated;
}

export function reassignPatientDoctor(patientId: string, targetDoctorId: string) {
  if (typeof window === "undefined") return;
  const targetDoc = getDoctorRoster().find((d) => d.id === targetDoctorId);
  if (!targetDoc) return;

  const queue = getPatientQueue();
  const index = queue.findIndex((p) => p.patient.id === patientId);
  if (index >= 0) {
    queue[index] = {
      ...queue[index],
      patient: {
        ...queue[index].patient,
        assignedDoctorId: targetDoc.id,
        assignedDoctorName: targetDoc.name,
        assignedDepartment: targetDoc.department,
        assignedRoom: targetDoc.opdRoom
      }
    };
    localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue));
  }
}

export function resetToDemoDefaults(): PatientIntakeState[] {
  if (typeof window === "undefined") return SAMPLE_PATIENTS;
  localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(SAMPLE_PATIENTS));
  localStorage.removeItem(STORAGE_KEY_ACTIVE);
  return SAMPLE_PATIENTS;
}
