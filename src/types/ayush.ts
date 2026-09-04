export type PrakritiDosha = "Vata" | "Pitta" | "Kapha" | "Vata-Pitta" | "Pitta-Kapha" | "Vata-Kapha" | "Tridoshic";

export type AgniType = "Sama" | "Vishama" | "Tikshna" | "Manda"; // Balanced, Irregular (Vata), Intense (Pitta), Sluggish (Kapha)

export type KoshthaType = "Krura" | "Mrudu" | "Madhyama"; // Hard (Vata), Soft (Pitta), Moderate (Kapha)

export interface DashavidhaPariksha {
  // 1. Prakriti (Constitution)
  prakriti: {
    primary: PrakritiDosha;
    vataScore: number;
    pittaScore: number;
    kaphaScore: number;
    characteristics: string[];
  };
  // 2. Vikriti (Pathological Imbalance)
  vikriti: {
    aggravatedDosha: PrakritiDosha;
    symptoms: string[];
    severity: "Alpa" | "Madhyama" | "Bahu";
  };
  // 3. Sara (Tissue Excellence)
  sara: {
    type: "Twak" | "Rakta" | "Mamsa" | "Meda" | "Asthi" | "Majja" | "Shukra" | "Sarva";
    quality: "Pravara" | "Madhyama" | "Avara"; // Superior, Medium, Inferior
  };
  // 4. Samhanana (Body Compactness)
  samhanana: "Pravara" | "Madhyama" | "Avara";
  // 5. Pramana (Anthropometric Proportions)
  pramana: "Sama" | "Vishama";
  // 6. Satmya (Habituation / Adaptability)
  satmya: "Pravara" | "Madhyama" | "Avara";
  // 7. Sattva (Mental Temperament)
  sattva: "Pravara" | "Madhyama" | "Avara"; // High resilience, Moderate, Low
  // 8. Ahara-Shakti (Digestive / Food Intake Capacity)
  aharaShakti: {
    abhyavaharanaShakti: "High" | "Medium" | "Low"; // Intake capacity
    jaranaShakti: "High" | "Medium" | "Low"; // Digestion capacity
    agni: AgniType;
  };
  // 9. Vyayama-Shakti (Physical Endurance)
  vyayamaShakti: "Pravara" | "Madhyama" | "Avara";
  // 10. Vaya (Age Stage)
  vaya: "Bala" | "Madhyama" | "Vriddha"; // Childhood, Youth/Adult, Elderly
}

export interface AyushClinicalAssessment {
  dashavidha: DashavidhaPariksha;
  koshtha: KoshthaType;
  nidana: string[]; // Etiological factors (unwholesome food, erratic routine, stress)
  sampraptiGhataka: {
    dosha: string;
    dushya: string;
    srotas: string;
    srotodushtiType: string;
  };
  trividhaPariksha: {
    darshana: string; // Inspection
    sparshana: string; // Palpation
    prashna: string; // Interrogation
  };
  ashtavidhaPariksha: {
    nadi: string; // Pulse
    mutra: string; // Urine
    mala: string; // Stool
    jihva: string; // Tongue (e.g. coated/sama, red/dry)
    shabda: string; // Voice
    sparsha: string; // Touch (warm, rough, cold)
    drik: string; // Eyes
    akriti: string; // General physical posture
  };
}
