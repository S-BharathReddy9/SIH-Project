export type LanguageCode = "en" | "hi" | "ta" | "te" | "kn" | "bn";
export type PatientStatus =
  | "REGISTERED"
  | "WAITING"
  | "CONSULTING"
  | "ADMITTED"
  | "UNDER_OBSERVATION"
  | "READY_FOR_DISCHARGE"
  | "DISCHARGED";

export interface PatientIdentity {
  id: string;
  name: string;
  dateOfBirth?: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  abhaId?: string;
  phone?: string;
  address?: string;
  patientType?: "New" | "Existing";
  status?: PatientStatus;
  admissionTimestamp?: string;
  dischargeInitiatedTimestamp?: string;
  dischargeTimestamp?: string;
  dischargeSummary?: string;
  language: LanguageCode;
  consentGiven: boolean;
  consentTimestamp?: string;
  opdToken?: string;
  triageCategory: "Emergency" | "Urgent" | "Routine";
  intakeTimestamp: string;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  assignedDepartment?: string;
  assignedRoom?: string;
}

export interface SocratesAssessment {
  site: string; // Where is the pain/symptom?
  onset: string; // When did it start? Sudden vs gradual
  character: string; // Sharp, dull, throbbing, burning, crushing
  radiation: string; // Spreading to arm, jaw, back, legs, nowhere
  associatedSymptoms: string[]; // Nausea, sweating, breathlessness, dizziness, fever, cough
  timeCourse: string; // Constant, comes and goes, getting worse
  exacerbatingFactors: string; // Worse with walking, food, breathing, exertion
  relievingFactors: string; // Better with rest, antacids, sitting up
  severity: number; // 1 - 10 scale
}

export interface ChiefComplaintItem {
  id: string;
  symptom: string;
  symptomHi: string;
  duration: string;
  severity: "mild" | "moderate" | "severe";
  iconName: string;
  isRedFlag?: boolean;
}

export interface RedFlagAlert {
  triggered: boolean;
  code: string;
  title: string;
  description: string;
  actionRequired: string;
  category: "CARDIAC" | "STROKE" | "RESPIRATORY" | "SEPSIS" | "ACUTE_ABDOMEN";
}

export interface PatientIntakeState {
  patient: PatientIdentity;
  chiefComplaints: ChiefComplaintItem[];
  socrates: SocratesAssessment;
  isAyushMode: boolean;
  ayushAssessment?: any;
  pastMedicalHistory: string[];
  pastSurgicalHistory: string[];
  currentMedications: string[];
  knownAllergies: string[];
  familyHistory: string[];
  personalHistory: {
    diet: "Vegetarian" | "Non-Vegetarian" | "Vegan" | string;
    smoking: "Never" | "Former" | "Current" | string;
    alcohol: "Never" | "Occasional" | "Regular" | string;
    bowelHabits: string;
    appetite: string;
  };
  reviewOfSystems: {
    system: string;
    status: "Normal" | "Abnormal";
    notes?: string;
  }[];
  redFlagAlert?: RedFlagAlert;
  scannedDocuments: any[];
  doctorReviewNotes?: string;
  doctorConfirmed: boolean;
}
