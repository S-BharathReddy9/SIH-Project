import { ExtractedLabTest, ExtractedMedication, ScannedMedicalDocument } from "@/types/document";
import { NORMAL_LAB_RANGES, DRUG_INTERACTION_RULES } from "@/data/medicalKnowledge";

export interface OcrExtractionResult {
  documentTitle: string;
  diagnoses: string[];
  medications: ExtractedMedication[];
  labTests: ExtractedLabTest[];
  anomalies: string[];
  drugInteractions: string[];
  confidenceScore: number;
}

export function parseMedicalText(text: string): OcrExtractionResult {
  const result: OcrExtractionResult = {
    documentTitle: "Analyzed Medical Document",
    diagnoses: [],
    medications: [],
    labTests: [],
    anomalies: [],
    drugInteractions: [],
    confidenceScore: 94
  };

  const lower = text.toLowerCase();

  // 1. Detect Document Type & Title
  if (lower.includes("complete blood count") || lower.includes("automated hematology") || lower.includes("cbc")) {
    result.documentTitle = "Complete Blood Count (CBC) Laboratory Report";
  } else if (lower.includes("biochemistry") || lower.includes("blood sugar") || lower.includes("lipid profile")) {
    result.documentTitle = "Metabolic & Biochemical Pathology Report";
  } else if (lower.includes("opd slip") || lower.includes("prescription") || lower.includes("rx:")) {
    result.documentTitle = "Outpatient Clinical Prescription Slip";
  } else if (lower.includes("discharge summary")) {
    result.documentTitle = "Inpatient Hospital Discharge Summary";
  }

  // 2. Extract Common Diagnoses
  const diagnosisMatches = [
    { key: "diabetes", label: "Type 2 Diabetes Mellitus" },
    { key: "anemia", label: "Microcytic Hypochromic Anemia" },
    { key: "pallor", label: "Nutritional Anemia / Pallor" },
    { key: "hypertension", label: "Essential Hypertension" },
    { key: "cholelithiasis", label: "Cholelithiasis (Gallbladder calculi)" },
    { key: "amavata", label: "Amavata (Rheumatoid Arthritis)" },
    { key: "dyslipidemia", label: "Mixed Dyslipidemia" },
    { key: "hypothyroidism", label: "Primary Hypothyroidism" }
  ];

  for (const item of diagnosisMatches) {
    if (lower.includes(item.key) && !result.diagnoses.includes(item.label)) {
      result.diagnoses.push(item.label);
    }
  }

  // 3. Extract Lab Tests with regex matching
  // Patterns like: Hemoglobin 8.2 g/dL, Hb: 8.2, Fasting Blood Sugar 215 mg/dL
  const labPatterns: { name: string; regex: RegExp; category: ExtractedLabTest["category"]; unit: string }[] = [
    { name: "Hemoglobin", regex: /(?:hemoglobin|hb)\s*[:=-]?\s*([0-9]+\.?[0-9]*)\s*(?:g\/dl|gm\/dl)?/i, category: "Hematology", unit: "g/dL" },
    { name: "Platelet Count", regex: /(?:platelet count|platelets)\s*[:=-]?\s*([0-9,]+)\s*(?:\/cumm|\/ul)?/i, category: "Hematology", unit: "/uL" },
    { name: "WBC Count", regex: /(?:total leucocyte count|wbc|tlc)\s*[:=-]?\s*([0-9,]+)\s*(?:\/cumm|\/ul)?/i, category: "Hematology", unit: "/uL" },
    { name: "Fasting Blood Sugar", regex: /(?:fasting blood sugar|fbs)\s*[:=-]?\s*([0-9]+)\s*(?:mg\/dl)?/i, category: "Biochemistry", unit: "mg/dL" },
    { name: "Post-Prandial Sugar", regex: /(?:post prandial|ppbs)\s*[:=-]?\s*([0-9]+)\s*(?:mg\/dl)?/i, category: "Biochemistry", unit: "mg/dL" },
    { name: "HbA1c", regex: /(?:hba1c|glycated hb)\s*[:=-]?\s*([0-9]+\.?[0-9]*)\s*(?:%)?/i, category: "Biochemistry", unit: "%" },
    { name: "Serum Creatinine", regex: /(?:serum creatinine|creatinine)\s*[:=-]?\s*([0-9]+\.?[0-9]*)\s*(?:mg\/dl)?/i, category: "Kidney", unit: "mg/dL" },
    { name: "Total Cholesterol", regex: /(?:total cholesterol|cholesterol)\s*[:=-]?\s*([0-9]+)\s*(?:mg\/dl)?/i, category: "Lipid", unit: "mg/dL" }
  ];

  for (const lab of labPatterns) {
    const match = text.match(lab.regex);
    if (match && match[1]) {
      const numVal = parseFloat(match[1].replace(/,/g, ""));
      const range = NORMAL_LAB_RANGES[lab.name];
      let status: ExtractedLabTest["status"] = "Normal";
      let isAbnormal = false;

      if (range) {
        if (range.criticalLow && numVal <= range.criticalLow) {
          status = "Critical";
          isAbnormal = true;
          result.anomalies.push(`CRITICAL LOW: ${lab.name} is ${numVal} ${lab.unit} (Critical threshold <= ${range.criticalLow})`);
        } else if (range.criticalHigh && numVal >= range.criticalHigh) {
          status = "Critical";
          isAbnormal = true;
          result.anomalies.push(`CRITICAL HIGH: ${lab.name} is ${numVal} ${lab.unit} (Critical threshold >= ${range.criticalHigh})`);
        } else if (numVal < range.min) {
          status = "Low";
          isAbnormal = true;
          result.anomalies.push(`ABNORMAL LOW: ${lab.name} is ${numVal} ${lab.unit} (Normal range: ${range.min} - ${range.max})`);
        } else if (numVal > range.max) {
          status = "High";
          isAbnormal = true;
          result.anomalies.push(`ABNORMAL HIGH: ${lab.name} is ${numVal} ${lab.unit} (Normal range: ${range.min} - ${range.max})`);
        }
      }

      result.labTests.push({
        id: `lab-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        testName: lab.name,
        category: lab.category,
        value: numVal,
        unit: lab.unit,
        referenceRange: range ? `${range.min} - ${range.max}` : "Standard",
        status,
        abnormalFlag: isAbnormal,
        testDate: new Date().toISOString().split("T")[0]
      });
    }
  }

  // 4. Extract Medications (Tab / Cap / Syp / Inj)
  const medicationPatterns = [
    { regex: /(?:tab|tablet)\s+([a-zA-Z]+)\s+([0-9]+\s*(?:mg|mcg|gm))\s*[-–]?\s*([0-9]-[0-9]-[0-9]|od|bd|tds|qid)/i },
    { regex: /(?:syp|syrup)\s+([a-zA-Z]+)\s+([0-9]+\s*(?:ml|tsp))\s*[-–]?\s*([0-9]-[0-9]-[0-9]|od|bd|tds)/i },
    { regex: /(?:metformin)\s*([0-9]+\s*mg)?/i, defaultDose: "500 mg", defaultFreq: "1-0-1 (BD)" },
    { regex: /(?:telmisartan)\s*([0-9]+\s*mg)?/i, defaultDose: "40 mg", defaultFreq: "1-0-0 (OD)" },
    { regex: /(?:pantoprazole)\s*([0-9]+\s*mg)?/i, defaultDose: "40 mg", defaultFreq: "1-0-0 (OD empty stomach)" },
    { regex: /(?:atorvastatin)\s*([0-9]+\s*mg)?/i, defaultDose: "10 mg", defaultFreq: "0-0-1 (HS)" },
    { regex: /(?:aspirin)\s*([0-9]+\s*mg)?/i, defaultDose: "75 mg", defaultFreq: "1-0-0 (OD after food)" },
    { regex: /(?:ibuprofen)\s*([0-9]+\s*mg)?/i, defaultDose: "400 mg", defaultFreq: "SOS after food" },
    { regex: /(?:dexorange)/i, defaultDose: "10 ml", defaultFreq: "1-0-1 (BD after meals)" }
  ];

  const medicationNamesFound: string[] = [];

  for (const med of medicationPatterns) {
    const match = text.match(med.regex);
    if (match) {
      const drugName = match[1] ? match[1].trim() : med.regex.source.replace(/[^a-zA-Z]/g, "");
      const capitalized = drugName.charAt(0).toUpperCase() + drugName.slice(1);
      
      if (!medicationNamesFound.includes(capitalized.toLowerCase())) {
        medicationNamesFound.push(capitalized.toLowerCase());
        const dose = match[2] || (med as any).defaultDose || "Standard";
        const freq = match[3] || (med as any).defaultFreq || "OD";

        result.medications.push({
          id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: capitalized,
          dosage: dose,
          frequency: freq,
          timing: "After meals",
          duration: "30 days"
        });
      }
    }
  }

  // 5. Check Drug Interactions
  for (const rule of DRUG_INTERACTION_RULES) {
    const hasDrugA = medicationNamesFound.some(m => m.includes(rule.drugs[0].toLowerCase()));
    const hasDrugB = medicationNamesFound.some(m => m.includes(rule.drugs[1].toLowerCase()));
    if (hasDrugA && hasDrugB) {
      result.drugInteractions.push(`[${rule.severity} RISK] ${rule.drugs.join(" + ")}: ${rule.warning}`);
    }
  }

  return result;
}
