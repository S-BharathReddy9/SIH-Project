import { ScannedMedicalDocument } from "@/types/document";

export const SAMPLE_DOCUMENTS: ScannedMedicalDocument[] = [
  {
    id: "DOC-2024-001",
    title: "Handwritten OPD Prescription - District Civil Hospital",
    documentType: "Prescription",
    date: "2024-08-12",
    facilityOrDoctor: "Dr. A. K. Sharma (MD Gen Med) - District Civil Hospital, Lucknow",
    isHandwritten: true,
    confidenceScore: 92,
    rawOcrText: `DISTRICT HOSPITAL LUCKNOW
OPD SLIP - DEPT OF GENERAL MEDICINE
Date: 12/08/2024  Reg No: DH-49210
Pt Name: Sunita Devi  Age: 48F
C/o: Extreme generalized fatigue, weakness x 2 months, burning feet, nocturia.
O/E: Pallor +++, BP 138/86 mmHg, PR 84/min, Chest Clear, P/A Soft.
Rx:
1. Tab Metformin 500 mg - 1 tab BD after meals x 30 days
2. Tab Telmisartan 40 mg - 1 tab OD morning x 30 days
3. Tab Pantoprazole 40 mg - 1 tab OD before breakfast x 15 days
4. Syp Dexorange - 2 tsp BD after food x 1 month
Adv: CBC, FBS, PPBS, HbA1c, Serum Creatinine. Review after 2 weeks.
Sd/- Dr. A.K. Sharma`,
    extractedDiagnoses: [
      "Type 2 Diabetes Mellitus (Uncontrolled)",
      "Severe Pallor / Nutritional Anemia",
      "Essential Hypertension (Mild)"
    ],
    extractedMedications: [
      {
        id: "m1",
        name: "Tab Metformin",
        dosage: "500 mg",
        frequency: "1-0-1 (BD)",
        timing: "After meals",
        duration: "30 days",
        prescribedBy: "Dr. A.K. Sharma",
        prescribedDate: "2024-08-12"
      },
      {
        id: "m2",
        name: "Tab Telmisartan",
        dosage: "40 mg",
        frequency: "1-0-0 (OD)",
        timing: "Morning after food",
        duration: "30 days",
        prescribedBy: "Dr. A.K. Sharma",
        prescribedDate: "2024-08-12"
      },
      {
        id: "m3",
        name: "Tab Pantoprazole",
        dosage: "40 mg",
        frequency: "1-0-0 (OD)",
        timing: "Before breakfast",
        duration: "15 days",
        prescribedBy: "Dr. A.K. Sharma",
        prescribedDate: "2024-08-12"
      },
      {
        id: "m4",
        name: "Syrup Dexorange (Iron+Folic Acid)",
        dosage: "10 ml",
        frequency: "1-0-1 (BD)",
        timing: "After food",
        duration: "30 days",
        prescribedBy: "Dr. A.K. Sharma",
        prescribedDate: "2024-08-12"
      }
    ],
    extractedLabTests: [],
    highlightedAnomalies: [
      "Severe Pallor reported on physical exam",
      "Multiple chronic prescriptions without recent renal function check"
    ]
  },
  {
    id: "DOC-2024-002",
    title: "Complete Blood Count (CBC) Pathology Report",
    documentType: "LabReport",
    date: "2024-08-14",
    facilityOrDoctor: "Shree Krishna Diagnostic Center & Pathology Lab",
    isHandwritten: false,
    confidenceScore: 98,
    rawOcrText: `SHREE KRISHNA DIAGNOSTIC & PATHOLOGY
Patient: Sunita Devi | Age/Sex: 48Y / F | Ref by: Dr. A.K. Sharma
Sample Collected: 14-Aug-2024 08:30 AM | Report Date: 14-Aug-2024 02:15 PM
COMPLETE BLOOD COUNT (AUTOMATED HEMATOLOGY)
----------------------------------------------------------------------
Test Parameter            Observed Value   Units    Reference Range
----------------------------------------------------------------------
Hemoglobin (Hb)           8.2  [LOW]       g/dL     12.0 - 15.5
Total RBC Count           3.4              mil/uL   3.8 - 5.2
Total Leucocyte Count     7,800            /cumm    4,000 - 11,000
Platelet Count            210,000          /cumm    150,000 - 450,000
Hematocrit (PCV)          26.8 [LOW]       %        36.0 - 46.0
MCV                       72.5 [LOW]       fL       80.0 - 98.0
MCH                       23.1 [LOW]       pg       27.0 - 32.0
MCHC                      30.2 [LOW]       g/dL     32.0 - 36.0
Peripheral Smear: Microcytic Hypochromic Red Blood Cells with Anisopoikilocytosis.
Impression: Microcytic Hypochromic Anemia, suggestive of Iron Deficiency Anemia.`,
    extractedDiagnoses: [
      "Moderate to Severe Microcytic Hypochromic Anemia (Iron Deficiency)"
    ],
    extractedMedications: [],
    extractedLabTests: [
      {
        id: "l1",
        testName: "Hemoglobin",
        category: "Hematology",
        value: 8.2,
        unit: "g/dL",
        referenceRange: "12.0 - 15.5",
        status: "Low",
        abnormalFlag: true,
        testDate: "2024-08-14",
        notes: "Severely low hemoglobin requiring therapeutic iron replenishment"
      },
      {
        id: "l2",
        testName: "Hematocrit (PCV)",
        category: "Hematology",
        value: 26.8,
        unit: "%",
        referenceRange: "36.0 - 46.0",
        status: "Low",
        abnormalFlag: true,
        testDate: "2024-08-14"
      },
      {
        id: "l3",
        testName: "WBC Count",
        category: "Hematology",
        value: 7800,
        unit: "/uL",
        referenceRange: "4000 - 11000",
        status: "Normal",
        abnormalFlag: false,
        testDate: "2024-08-14"
      },
      {
        id: "l4",
        testName: "Platelet Count",
        category: "Hematology",
        value: 210000,
        unit: "/uL",
        referenceRange: "150000 - 450000",
        status: "Normal",
        abnormalFlag: false,
        testDate: "2024-08-14"
      }
    ],
    highlightedAnomalies: [
      "CRITICAL: Hemoglobin 8.2 g/dL is significantly below female baseline (12.0 - 15.5 g/dL)",
      "Microcytic indices (MCV 72.5 fL) confirm marked iron deficiency"
    ]
  },
  {
    id: "DOC-2024-003",
    title: "Glycemic & Renal Metabolic Profile",
    documentType: "LabReport",
    date: "2024-08-14",
    facilityOrDoctor: "Shree Krishna Diagnostic Center & Pathology Lab",
    isHandwritten: false,
    confidenceScore: 97,
    rawOcrText: `BIOCHEMISTRY INVESTIGATION REPORT
Patient: Sunita Devi | Date: 14-Aug-2024
----------------------------------------------------------------------
Fasting Blood Sugar (FBS)     215  [HIGH]     mg/dL    70 - 100
Post Prandial Sugar (PPBS)    310  [HIGH]     mg/dL    < 140
HbA1c (Glycated Hb)           8.9  [HIGH]     %        < 5.7 (Good: < 7.0)
Serum Creatinine              1.0             mg/dL    0.6 - 1.2
Blood Urea                    28              mg/dL    15 - 40
Estimated GFR (eGFR)          78              mL/min   > 90
Total Cholesterol             235  [HIGH]     mg/dL    125 - 200
Triglycerides                 190  [HIGH]     mg/dL    < 150
----------------------------------------------------------------------
Impression: Uncontrolled Hyperglycemia (HbA1c 8.9%) with Dyslipidemia. Renal function currently preserved.`,
    extractedDiagnoses: [
      "Poorly Controlled Type 2 Diabetes (HbA1c 8.9%)",
      "Mixed Dyslipidemia (Hypercholesterolemia)"
    ],
    extractedMedications: [],
    extractedLabTests: [
      {
        id: "l5",
        testName: "Fasting Blood Sugar",
        category: "Biochemistry",
        value: 215,
        unit: "mg/dL",
        referenceRange: "70 - 100",
        status: "High",
        abnormalFlag: true,
        testDate: "2024-08-14"
      },
      {
        id: "l6",
        testName: "Post-Prandial Sugar",
        category: "Biochemistry",
        value: 310,
        unit: "mg/dL",
        referenceRange: "< 140",
        status: "High",
        abnormalFlag: true,
        testDate: "2024-08-14"
      },
      {
        id: "l7",
        testName: "HbA1c",
        category: "Biochemistry",
        value: 8.9,
        unit: "%",
        referenceRange: "< 5.7",
        status: "High",
        abnormalFlag: true,
        testDate: "2024-08-14"
      },
      {
        id: "l8",
        testName: "Serum Creatinine",
        category: "Kidney",
        value: 1.0,
        unit: "mg/dL",
        referenceRange: "0.6 - 1.2",
        status: "Normal",
        abnormalFlag: false,
        testDate: "2024-08-14"
      },
      {
        id: "l9",
        testName: "Total Cholesterol",
        category: "Lipid",
        value: 235,
        unit: "mg/dL",
        referenceRange: "125 - 200",
        status: "High",
        abnormalFlag: true,
        testDate: "2024-08-14"
      }
    ],
    highlightedAnomalies: [
      "HIGH: Fasting Blood Sugar 215 mg/dL (Target < 100 mg/dL)",
      "HIGH: HbA1c 8.9% indicates prolonged suboptimal glycemic control",
      "HIGH: Total Cholesterol 235 mg/dL"
    ]
  },
  {
    id: "DOC-2023-088",
    title: "Discharge Summary - Laparoscopic Cholecystectomy",
    documentType: "DischargeSummary",
    date: "2023-04-18",
    facilityOrDoctor: "Sanjay Gandhi Post Graduate Institute / AIIMS",
    isHandwritten: false,
    confidenceScore: 99,
    rawOcrText: `DEPARTMENT OF SURGICAL GASTROENTEROLOGY
DISCHARGE SUMMARY
Patient: Sunita Devi | IPD No: SGPG-23-90812
Admission: 15/04/2023 | Discharge: 18/04/2023
Diagnosis: Symptomatic Cholelithiasis (Multiple Gallstones)
Procedure: Laparoscopic Cholecystectomy performed under GA on 16/04/2023.
Post-Op Course: Uneventful. Tolerated soft diet. Wounds clean and dry.
Discharge Advice: Avoid heavy lifting for 6 weeks, low fat diet.`,
    extractedDiagnoses: [
      "Status Post Laparoscopic Cholecystectomy (Apr 2023)"
    ],
    extractedMedications: [],
    extractedLabTests: [],
    highlightedAnomalies: [
      "Surgical history: Gallbladder removed in 2023"
    ]
  }
];
