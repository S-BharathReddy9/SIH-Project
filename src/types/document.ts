export type DocumentType = 
  | "Prescription" 
  | "LabReport" 
  | "DischargeSummary" 
  | "ImagingReport" 
  | "Other";

export interface ExtractedMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g., 1-0-1, OD, BD, TDS
  timing?: string; // Before food, After food
  duration: string;
  prescribedBy?: string;
  prescribedDate?: string;
  route?: string; // Oral, Topical, IV
}

export interface ExtractedLabTest {
  id: string;
  testName: string;
  category: "Hematology" | "Biochemistry" | "Lipid" | "Liver" | "Kidney" | "Thyroid" | "Other";
  value: number | string;
  unit: string;
  referenceRange: string;
  status: "Normal" | "High" | "Low" | "Critical";
  abnormalFlag: boolean;
  testDate: string;
  notes?: string;
}

export interface ScannedMedicalDocument {
  id: string;
  title: string;
  documentType: DocumentType;
  date: string;
  facilityOrDoctor: string;
  fileUrl?: string;
  rawOcrText: string;
  isHandwritten: boolean;
  confidenceScore: number; // e.g. 94%
  extractedDiagnoses: string[];
  extractedMedications: ExtractedMedication[];
  extractedLabTests: ExtractedLabTest[];
  highlightedAnomalies: string[];
}
