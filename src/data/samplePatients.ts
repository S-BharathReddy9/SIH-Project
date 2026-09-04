import { PatientIntakeState } from "@/types/intake";
import { SAMPLE_DOCUMENTS } from "./sampleDocuments";

export const SAMPLE_PATIENTS: PatientIntakeState[] = [
  // 1. EMERGENCY RED FLAG CASE: Ramesh Kumar
  {
    patient: {
      id: "PT-2024-8801",
      name: "Ramesh Kumar",
      age: 54,
      gender: "Male",
      abhaId: "ramesh.kumar@abdm",
      phone: "+91 98765 43210",
      language: "hi",
      consentGiven: true,
      consentTimestamp: "2024-09-03T09:15:00+05:30",
      opdToken: "EMERGENCY-01",
      triageCategory: "Emergency",
      intakeTimestamp: "2024-09-03T09:15:00+05:30",
      assignedDoctorId: "DOC-EMER-202",
      assignedDoctorName: "Dr. Rajesh Mehra",
      assignedDepartment: "Emergency & Resuscitation",
      assignedRoom: "Resuscitation Bay #1"
    },
    chiefComplaints: [
      {
        id: "chest_pain",
        symptom: "Severe crushing retrosternal chest pain",
        symptomHi: "छाती के बीच में असहनीय तेज भारीपन व दबाव",
        duration: "90 minutes",
        severity: "severe",
        iconName: "HeartPulse",
        isRedFlag: true
      },
      {
        id: "shortness_of_breath",
        symptom: "Shortness of breath and profuse diaphoresis (cold sweats)",
        symptomHi: "सांस फूलना व अत्यधिक पसीना आना",
        duration: "90 minutes",
        severity: "severe",
        iconName: "Wind",
        isRedFlag: true
      }
    ],
    socrates: {
      site: "Retrosternal (center of chest), feels like a heavy elephant sitting on the chest",
      onset: "Sudden onset while climbing stairs 90 minutes ago, progressively worsening",
      character: "Crushing, squeezing, intense pressure",
      radiation: "Radiating to the left shoulder, left inner arm, and lower jaw",
      associatedSymptoms: ["Profuse cold sweating", "Nausea", "Lightheadedness", "Severe breathlessness"],
      timeCourse: "Constant and relentless, no relief over the last 90 minutes",
      exacerbatingFactors: "Any movement or deep breathing aggravates distress",
      relievingFactors: "None. Sublingual sorbitrate taken at home provided negligible relief",
      severity: 9
    },
    isAyushMode: false,
    pastMedicalHistory: [
      "Known Hypertensive x 6 years (irregular compliance)",
      "Dyslipidemia diagnosed 2 years ago"
    ],
    pastSurgicalHistory: ["None"],
    currentMedications: [
      "Tab Amlodipine 5 mg OD (irregular)",
      "Tab Atorvastatin 10 mg at bedtime"
    ],
    knownAllergies: ["No known drug allergies (NKDA)"],
    familyHistory: [
      "Father had fatal Myocardial Infarction at age 52",
      "Elder brother underwent CABG at age 58"
    ],
    personalHistory: {
      diet: "Non-Vegetarian",
      smoking: "Current (15 bidis/day for 25 years)",
      alcohol: "Occasional (country liquor on weekends)",
      bowelHabits: "Regular",
      appetite: "Poor today due to nausea"
    },
    reviewOfSystems: [
      { system: "Cardiovascular", status: "Abnormal", notes: "Severe retrosternal squeezing pain radiating to left arm" },
      { system: "Respiratory", status: "Abnormal", notes: "Tachypneic, breathlessness at rest" },
      { system: "Gastrointestinal", status: "Abnormal", notes: "Nausea without vomiting" },
      { system: "Neurological", status: "Normal", notes: "Conscious, oriented, anxious" }
    ],
    redFlagAlert: {
      triggered: true,
      code: "RF_CARDIAC_ACS",
      title: "CRITICAL RED FLAG: Suspected Acute Coronary Syndrome (ACS / STEMI)",
      description: "Severe squeezing retrosternal chest pain with left arm/jaw radiation, profuse cold sweats, and dyspnea in a 54M smoker with family history of premature CAD.",
      actionRequired: "IMMEDIATE CODE RED: Route straight to Resuscitation Bay. Stat 12-lead ECG, IV line, Aspirin 300mg + Clopidogrel 300mg + Atorvastatin 80mg loading dose per hospital ACS protocol.",
      category: "CARDIAC"
    },
    scannedDocuments: [],
    doctorReviewNotes: "",
    doctorConfirmed: false
  },

  // 2. CHRONIC ALLOPATHY CASE WITH OLD SCANNED REPORTS: Sunita Devi
  {
    patient: {
      id: "PT-2024-4921",
      name: "Sunita Devi",
      age: 48,
      gender: "Female",
      abhaId: "sunita.devi@abdm",
      phone: "+91 94150 11223",
      language: "hi",
      consentGiven: true,
      consentTimestamp: "2024-09-03T09:30:00+05:30",
      opdToken: "GEN-042",
      triageCategory: "Routine",
      intakeTimestamp: "2024-09-03T09:30:00+05:30",
      assignedDoctorId: "DOC-MED-101",
      assignedDoctorName: "Dr. A. K. Sharma",
      assignedDepartment: "General Medicine",
      assignedRoom: "OPD Room #4"
    },
    chiefComplaints: [
      {
        id: "fatigue_weakness",
        symptom: "Severe progressive generalized weakness and easy fatigability",
        symptomHi: "अत्यधिक कमजोरी, जल्दी थक जाना और चक्कर आना",
        duration: "2 months",
        severity: "moderate",
        iconName: "ZapOff"
      },
      {
        id: "polyuria_nocturia",
        symptom: "Frequent urination (nocturia 3-4 times/night) and burning sensations in soles of feet",
        symptomHi: "रात में बार-बार पेशाब आना और पैरों के तलवों में जलन",
        duration: "1 month",
        severity: "moderate",
        iconName: "Flame"
      }
    ],
    socrates: {
      site: "Generalized body exhaustion; burning paresthesia localized symmetrically in both feet soles",
      onset: "Gradual onset over past 2 months, worsening steadily",
      character: "Deep fatigue, lethargy, pins-and-needles burning in feet",
      radiation: "Burning sensations in feet extending up to mid-calf",
      associatedSymptoms: ["Exertional breathlessness climbing one flight of stairs", "Increased thirst (polydipsia)", "Nocturia"],
      timeCourse: "Continuous daily exhaustion, worse in the evenings",
      exacerbatingFactors: "Walking or prolonged standing exacerbates burning soles",
      relievingFactors: "Rest partially relieves fatigue",
      severity: 6
    },
    isAyushMode: false,
    pastMedicalHistory: [
      "Type 2 Diabetes Mellitus diagnosed 4 years ago (irregular followup)",
      "Essential Hypertension x 2 years",
      "History of Chronic Iron Deficiency Anemia"
    ],
    pastSurgicalHistory: [
      "Laparoscopic Cholecystectomy (Apr 2023 at SGPGIMS, Lucknow)"
    ],
    currentMedications: [
      "Tab Metformin 500 mg BD",
      "Tab Telmisartan 40 mg OD",
      "Tab Pantoprazole 40 mg OD",
      "Syrup Dexorange 2 tsp BD"
    ],
    knownAllergies: ["Penicillin (reports urticarial skin rash in childhood)"],
    familyHistory: [
      "Mother has Type 2 Diabetes and Diabetic Nephropathy",
      "Sister treated for Hypothyroidism"
    ],
    personalHistory: {
      diet: "Vegetarian",
      smoking: "Never",
      alcohol: "Never",
      bowelHabits: "Prone to occasional constipation",
      appetite: "Normal, but craving sweets frequently"
    },
    reviewOfSystems: [
      { system: "General", status: "Abnormal", notes: "Marked pallor, lethargic demeanor" },
      { system: "Endocrine/Metabolic", status: "Abnormal", notes: "Polydipsia, polyuria, uncontrolled hyperglycemia" },
      { system: "Hematological", status: "Abnormal", notes: "Hemoglobin 8.2 g/dL on OCR scanned report" },
      { system: "Neurological", status: "Abnormal", notes: "Symmetric distal sensory burning paresthesia (Diabetic peripheral neuropathy)" }
    ],
    redFlagAlert: {
      triggered: false,
      code: "NO_ACUTE_RED_FLAG",
      title: "Routine OPD Consultation",
      description: "No acute life threats detected; requires chronic glycemic optimization and parenteral/oral iron replenishment.",
      actionRequired: "Proceed to General Medicine Consultation Room #4.",
      category: "SEPSIS"
    },
    scannedDocuments: SAMPLE_DOCUMENTS,
    doctorReviewNotes: "",
    doctorConfirmed: false
  },

  // 3. AYUSH / AYURVEDA CHRONIC AMAVATA CASE: Rajeshwari Sharma
  {
    patient: {
      id: "PT-2024-3319",
      name: "Rajeshwari Sharma",
      age: 42,
      gender: "Female",
      abhaId: "rajeshwari.ayush@abdm",
      phone: "+91 93214 55667",
      language: "hi",
      consentGiven: true,
      consentTimestamp: "2024-09-03T10:00:00+05:30",
      opdToken: "AYUSH-14",
      triageCategory: "Routine",
      intakeTimestamp: "2024-09-03T10:00:00+05:30",
      assignedDoctorId: "DOC-AYUSH-303",
      assignedDoctorName: "Vaidya Priya Nair",
      assignedDepartment: "AYUSH / Kayachikitsa",
      assignedRoom: "AYUSH OPD Room #2"
    },
    chiefComplaints: [
      {
        id: "joint_pain",
        symptom: "Multiple bilateral joint pains, morning stiffness lasting > 1 hour (Amavata / Sandhishoola)",
        symptomHi: "हाथ-पैरों के जोड़ों में तेज दर्द, सूजन व सुबह की अकड़न (आमवात)",
        duration: "6 months",
        severity: "moderate",
        iconName: "Activity"
      },
      {
        id: "stomach_pain",
        symptom: "Heaviness in abdomen, poor appetite, indigestion, coated white tongue (Alpa Agni / Ajeerna)",
        symptomHi: "पेट में भारीपन, भूख न लगना, अपच व जीभ पर सफेद परत",
        duration: "3 months",
        severity: "moderate",
        iconName: "Flame"
      }
    ],
    socrates: {
      site: "Bilateral wrists, metacarpophalangeal joints, knees, and ankles",
      onset: "Insidious onset 6 months ago following a viral illness and dietary irregularity",
      character: "Throbbing pain like scorpion sting (Vrishchika-danshavat vedana), severe stiffness",
      radiation: "Migrates from smaller joints of hands to knees and ankles (Sanchari vedana)",
      associatedSymptoms: ["Morning stiffness for 90 minutes", "Swelling (Shotha) with local heat", "Sluggish digestion (Agnimandya)", "Lethargy (Gaurava)"],
      timeCourse: "Aggravated in cloudy/cold weather and early morning; better with dry warm fomentation",
      exacerbatingFactors: "Cold water bath, daytime sleeping (Divaswapna), curd, fermented foods",
      relievingFactors: "Dry heat fomentation (Valuka sweda), warm water, light hot meals",
      severity: 7
    },
    isAyushMode: true,
    ayushAssessment: {
      dashavidha: {
        prakriti: {
          primary: "Vata-Kapha",
          vataScore: 45,
          pittaScore: 20,
          kaphaScore: 35,
          characteristics: ["Slender build with stiff joints", "Dry skin prone to cracking in winter", "Variable, anxious sleep pattern"]
        },
        vikriti: {
          aggravatedDosha: "Vata-Kapha",
          symptoms: ["Ama formation (endotoxin accumulation)", "Srotorodha (microchannel blockage)", "Shoola (intense pain)", "Stambha (stiffness)"],
          severity: "Madhyama"
        },
        sara: {
          type: "Asthi",
          quality: "Madhyama"
        },
        samhanana: "Madhyama",
        pramana: "Sama",
        satmya: "Madhyama",
        sattva: "Madhyama",
        aharaShakti: {
          abhyavaharanaShakti: "Low",
          jaranaShakti: "Low",
          agni: "Manda" // Sluggish digestion
        },
        vyayamaShakti: "Avara", // Low physical tolerance due to joint pain
        vaya: "Madhyama"
      },
      koshtha: "Krura", // Constipated, dry stool
      nidana: [
        "Viruddha Ahara (incompatible food combinations: milk with salty foods)",
        "Divaswapna (habitual sleeping during daytime)",
        "Snigdha-Guru Ahara (heavy, oily, deep-fried snacks)",
        "Lack of regular physical activity (Avyayama)"
      ],
      sampraptiGhataka: {
        dosha: "Vata-Kapha (specifically Vyana Vayu and Shleshaka Kapha)",
        dushya: "Rasa, Asthi, Sandhi",
        srotas: "Rasavaha, Asthivaha srotas",
        srotodushtiType: "Sanga (obstruction due to Ama)"
      },
      trividhaPariksha: {
        darshana: "Bilateral joint swelling (Sandhishotha), pallor of conjunctiva, sluggish posture",
        sparshana: "Warmth over inflamed joints, tender on palpation, dry cool skin elsewhere",
        prashna: "Reports worsening after heavy curd/sour food, morning stiffness > 60 minutes"
      },
      ashtavidhaPariksha: {
        nadi: "Manda, Gambhira, Sama Nadi (Slow, deep pulse indicating Ama accumulation)",
        mutra: "Peeta varna (pale yellow), Avila (slightly turbid in mornings)",
        mala: "Vibandha (constipated), Sa-Ama (sticky stool with mucus, sinks in water)",
        jihva: "Upalipta (thick white coating over tongue base, denoting Agnimandya)",
        shabda: "Prakrita (clear normal voice)",
        sparsha: "Sheetala ruksha twak, ushna at sandhi",
        drik: "Prakrita (clear vision)",
        akriti: "Madhyama, guarded antalgic gait"
      }
    },
    pastMedicalHistory: ["Hypothyroidism x 3 years on Thyroxine 50 mcg"],
    pastSurgicalHistory: ["None"],
    currentMedications: [
      "Tab Levothyroxine 50 mcg OD empty stomach",
      "Over-the-counter Painkillers (Ibuprofen / Aceclofenac) taken intermittently"
    ],
    knownAllergies: ["NKDA"],
    familyHistory: ["Maternal grandmother had severe crippling arthritis"],
    personalHistory: {
      diet: "Vegetarian",
      smoking: "Never",
      alcohol: "Never",
      bowelHabits: "Irregular, dry, hard stools once in 2-3 days (Krura Koshtha)",
      appetite: "Sluggish, feeling of fullness even after skipping a meal"
    },
    reviewOfSystems: [
      { system: "Musculoskeletal", status: "Abnormal", notes: "Multiple joint swelling, morning stiffness > 90 min (Amavata)" },
      { system: "Digestive/Agni", status: "Abnormal", notes: "Agnimandya, coated tongue (Sama Jihva), sticky stools" }
    ],
    redFlagAlert: {
      triggered: false,
      code: "AYUSH_CHRONIC",
      title: "AYUSH OPD - Chronic Amavata Management",
      description: "Subacute Ama accumulation with Vata-Kapha vitiation. Suitable for Deepana-Pachana, Svedana, and Vaitarana Basti protocols.",
      actionRequired: "Assigned to Dept of Kayachikitsa / Panchakarma OPD.",
      category: "ACUTE_ABDOMEN"
    },
    scannedDocuments: [],
    doctorReviewNotes: "",
    doctorConfirmed: false
  },

  // 4. ENDOCRINOLOGY SPECIALTY CASE: Arvind Patel
  {
    patient: {
      id: "PT-2024-5108",
      name: "Arvind Patel",
      age: 58,
      gender: "Male",
      abhaId: "arvind.patel@abdm",
      phone: "+91 97123 44556",
      language: "en",
      consentGiven: true,
      consentTimestamp: "2024-09-03T10:15:00+05:30",
      opdToken: "ENDO-08",
      triageCategory: "Urgent",
      intakeTimestamp: "2024-09-03T10:15:00+05:30",
      assignedDoctorId: "DOC-ENDO-404",
      assignedDoctorName: "Dr. Meenakshi Sundaram",
      assignedDepartment: "Endocrinology & Diabetology",
      assignedRoom: "Specialty Clinic Room #7"
    },
    chiefComplaints: [
      {
        id: "diabetic_ulcer",
        symptom: "Non-healing ulcer on right plantar great toe with serous discharge",
        symptomHi: "दाहिने पैर के अंगूठे में न भरने वाला घाव व मवाद",
        duration: "3 weeks",
        severity: "severe",
        iconName: "Flame",
        isRedFlag: false
      },
      {
        id: "polyuria_blur",
        symptom: "Severe polyuria, polydipsia, and blurred vision over past month",
        symptomHi: "अत्यधिक प्यास, बार-बार पेशाब और आंखों से धुंधला दिखना",
        duration: "1 month",
        severity: "moderate",
        iconName: "Eye"
      }
    ],
    socrates: {
      site: "Plantar surface of right first metatarsophalangeal head / great toe",
      onset: "Started as small painless blister after walking in new sandals 3 weeks ago",
      character: "Dull throbbing ache, mostly insensitive due to glove-and-stocking sensory loss",
      radiation: "Mild tenderness extending upward to dorsum of right foot",
      associatedSymptoms: ["Impaired monofilament sensation", "Distal foot coldness", "Blurry vision", "Recent 4 kg weight loss"],
      timeCourse: "Progressively enlarging ulcer diameter (now ~1.5 cm with calloused margin)",
      exacerbatingFactors: "Weight-bearing and walking",
      relievingFactors: "Limb elevation, non-weight bearing",
      severity: 6
    },
    isAyushMode: false,
    pastMedicalHistory: [
      "Type 2 Diabetes Mellitus x 11 years (HbA1c 10.4%)",
      "Diabetic Peripheral Neuropathy x 3 years",
      "Dyslipidemia on Statin therapy"
    ],
    pastSurgicalHistory: ["None"],
    currentMedications: [
      "Inj Premixed Insulin 30/70 24 units SC before breakfast, 16 units SC before dinner",
      "Tab Metformin 1000 mg SR BD",
      "Tab Pregabalin 75 mg at bedtime"
    ],
    knownAllergies: ["Sulfa drugs (causes cutaneous erythema)"],
    familyHistory: ["Both parents had Type 2 Diabetes; maternal uncle had below-knee amputation"],
    personalHistory: {
      diet: "Vegetarian with frequent high-glycemic snacks",
      smoking: "Former smoker (quit 5 years ago)",
      alcohol: "Social, 1-2 drinks/month",
      bowelHabits: "Normal",
      appetite: "Increased (polyphagia)"
    },
    reviewOfSystems: [
      { system: "Integumentary", status: "Abnormal", notes: "Grade 1 Wagner plantar ulcer right great toe, no osteomyelitis on plain X-ray" },
      { system: "Endocrine", status: "Abnormal", notes: "Uncontrolled glycemia, random blood sugar 298 mg/dL" },
      { system: "Neurological", status: "Abnormal", notes: "Loss of 10g Semmes-Weinstein monofilament sensation bilaterally" }
    ],
    redFlagAlert: {
      triggered: false,
      code: "URGENT_DIABETIC_FOOT",
      title: "Urgent Diabetic Foot Care & Glycemic Optimization",
      description: "Wagner Grade 1 neuropathic plantar ulcer with uncontrolled glycemia (RBS 298 mg/dL). High risk of deep tissue progression.",
      actionRequired: "Priority review by Consultant Diabetologist in Room #7. Wound debridement & insulin titration.",
      category: "SEPSIS"
    },
    scannedDocuments: [],
    doctorReviewNotes: "",
    doctorConfirmed: false
  }
];
