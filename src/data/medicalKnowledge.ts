import { ChiefComplaintItem, RedFlagAlert } from "@/types/intake";

export const RED_FLAG_CRITERIA: RedFlagAlert[] = [
  {
    triggered: false,
    code: "RF_CARDIAC_ACS",
    title: "CRITICAL: Suspected Acute Coronary Syndrome / Myocardial Infarction",
    description: "Patient reports severe crushing retrosternal chest pain radiating to left arm/jaw, accompanied by sweating, shortness of breath, or nausea.",
    actionRequired: "IMMEDIATE EMERGENCY CODE RED: Route to Resuscitation Bay / Emergency Room immediately. Stat ECG, Oxygen, IV access, and On-duty Cardiologist/Medical Officer alert.",
    category: "CARDIAC"
  },
  {
    triggered: false,
    code: "RF_STROKE_FAST",
    title: "CRITICAL: Suspected Acute Cerebrovascular Stroke (FAST Alert)",
    description: "Sudden onset facial drooping, arm or leg weakness, numbness, speech slurring or inability to speak within last 4.5 hours.",
    actionRequired: "IMMEDIATE STROKE PROTOCOL: Priority Transfer to Emergency Dept / CT Brain Scanner for thrombolysis window evaluation.",
    category: "STROKE"
  },
  {
    triggered: false,
    code: "RF_RESPIRATORY_DISTRESS",
    title: "CRITICAL: Acute Severe Respiratory Distress / Hypoxia",
    description: "Severe breathlessness at rest, inability to complete a full sentence in one breath, stridor, cyanosis.",
    actionRequired: "IMMEDIATE TRIAGE: High-flow oxygen supplementation, continuous pulse oximetry, nebulization, and urgent ICU/ER review.",
    category: "RESPIRATORY"
  },
  {
    triggered: false,
    code: "RF_ACUTE_ABDOMEN",
    title: "URGENT: Suspected Acute Peritonitis / Surgical Abdomen",
    description: "Severe sudden abdominal pain with board-like rigidity, persistent vomiting, high fever, or hematemesis.",
    actionRequired: "URGENT SURGICAL TRIAGE: Keep NPO (nil per os), initiate IV fluids, urgent ultrasound/X-ray erect abdomen and surgical consult.",
    category: "ACUTE_ABDOMEN"
  }
];

export const COMMON_COMPLAINTS: ChiefComplaintItem[] = [
  {
    id: "chest_pain",
    symptom: "Chest Pain / Discomfort",
    symptomHi: "छाती में दर्द या भारीपन",
    duration: "2 hours",
    severity: "severe",
    iconName: "HeartPulse",
    isRedFlag: true
  },
  {
    id: "shortness_of_breath",
    symptom: "Shortness of Breath",
    symptomHi: "सांस लेने में तकलीफ",
    duration: "1 day",
    severity: "severe",
    iconName: "Wind",
    isRedFlag: true
  },
  {
    id: "fever",
    symptom: "Fever & Chills",
    symptomHi: "बुखार और ठंड लगना",
    duration: "3 days",
    severity: "moderate",
    iconName: "Thermometer"
  },
  {
    id: "joint_pain",
    symptom: "Joint Pain & Stiffness",
    symptomHi: "जोड़ों में दर्द व जकड़न (संधिशूल)",
    duration: "3 months",
    severity: "moderate",
    iconName: "Activity"
  },
  {
    id: "stomach_pain",
    symptom: "Stomach Pain / Acidity",
    symptomHi: "पेट दर्द या गैस / जलन",
    duration: "1 week",
    severity: "moderate",
    iconName: "Flame"
  },
  {
    id: "headache",
    symptom: "Severe Headache",
    symptomHi: "तेज सिरदर्द",
    duration: "2 days",
    severity: "moderate",
    iconName: "Brain"
  },
  {
    id: "cough",
    symptom: "Persistent Cough",
    symptomHi: "लगातार खांसी या कफ",
    duration: "2 weeks",
    severity: "mild",
    iconName: "Stethoscope"
  },
  {
    id: "fatigue_weakness",
    symptom: "Severe Fatigue & Weakness",
    symptomHi: "अत्यधिक कमजोरी व थकान",
    duration: "1 month",
    severity: "moderate",
    iconName: "ZapOff"
  }
];

export const NORMAL_LAB_RANGES: Record<string, { min: number; max: number; unit: string; criticalLow?: number; criticalHigh?: number }> = {
  "Hemoglobin": { min: 12.0, max: 16.0, unit: "g/dL", criticalLow: 7.0 },
  "RBC Count": { min: 4.0, max: 5.5, unit: "mil/uL" },
  "WBC Count": { min: 4000, max: 11000, unit: "/uL", criticalHigh: 20000 },
  "Platelet Count": { min: 150000, max: 450000, unit: "/uL", criticalLow: 50000 },
  "Fasting Blood Sugar": { min: 70, max: 100, unit: "mg/dL", criticalHigh: 300, criticalLow: 50 },
  "Post-Prandial Sugar": { min: 90, max: 140, unit: "mg/dL", criticalHigh: 350 },
  "HbA1c": { min: 4.0, max: 5.6, unit: "%", criticalHigh: 10.0 },
  "Serum Creatinine": { min: 0.6, max: 1.2, unit: "mg/dL", criticalHigh: 3.5 },
  "Blood Urea": { min: 15, max: 40, unit: "mg/dL" },
  "Total Cholesterol": { min: 125, max: 200, unit: "mg/dL" },
  "Serum Bilirubin": { min: 0.2, max: 1.2, unit: "mg/dL" },
  "SGPT / ALT": { min: 7, max: 56, unit: "U/L" }
};

export const DRUG_INTERACTION_RULES = [
  {
    drugs: ["Aspirin", "Ibuprofen"],
    severity: "High",
    warning: "Concurrent use of Aspirin and Ibuprofen significantly increases gastric ulceration and severe GI bleeding risk."
  },
  {
    drugs: ["Metformin", "Iodinated Contrast"],
    severity: "Critical",
    warning: "Risk of Metformin-associated Lactic Acidosis if contrast CT is performed without withholding Metformin."
  },
  {
    drugs: ["Telmisartan", "Potassium Supplements"],
    severity: "High",
    warning: "Risk of severe Hyperkalemia when ARB (Telmisartan) is combined with Potassium supplements."
  }
];
