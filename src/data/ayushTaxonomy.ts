import { AgniType, KoshthaType, PrakritiDosha } from "@/types/ayush";

export interface PrakritiQuestion {
  id: string;
  feature: string;
  featureHi: string;
  vataTrait: string;
  pittaTrait: string;
  kaphaTrait: string;
}

export const PRAKRITI_QUESTIONNAIRE: PrakritiQuestion[] = [
  {
    id: "body_frame",
    feature: "Body Frame & Build",
    featureHi: "शरीर की बनावट व ढांचा",
    vataTrait: "Lean, thin, prominent joints, difficulty gaining weight",
    pittaTrait: "Medium build, athletic, well-proportioned muscles",
    kaphaTrait: "Broad, heavy build, sturdy, gains weight easily"
  },
  {
    id: "skin_texture",
    feature: "Skin Texture & Complexion",
    featureHi: "त्वचा का प्रकार व रंग",
    vataTrait: "Dry, rough, cool to touch, cracks easily",
    pittaTrait: "Warm, reddish/fair, prone to moles/freckles/acne",
    kaphaTrait: "Smooth, oily, cool, thick and radiant"
  },
  {
    id: "digestion_appetite",
    feature: "Appetite & Digestion (Agni)",
    featureHi: "भूख व पाचन शक्ति (अग्नि)",
    vataTrait: "Irregular, variable, bloating/gas (Vishama Agni)",
    pittaTrait: "Strong, sharp hunger, acidity if meals missed (Tikshna Agni)",
    kaphaTrait: "Slow, steady appetite, heavy post-meal feel (Manda Agni)"
  },
  {
    id: "bowel_movements",
    feature: "Bowel Habits (Koshtha)",
    featureHi: "मल त्याग की प्रवृत्ति (कोष्ठ)",
    vataTrait: "Hard, dry, irregular, prone to constipation (Krura Koshtha)",
    pittaTrait: "Soft, loose, frequent, easily purged by milk (Mrudu Koshtha)",
    kaphaTrait: "Regular, sluggish, moderate, sticky (Madhyama Koshtha)"
  },
  {
    id: "sleep_pattern",
    feature: "Sleep & Mind Temperament",
    featureHi: "नींद व मानसिक स्वभाव",
    vataTrait: "Light, interrupted sleep, active restless mind, anxious",
    pittaTrait: "Moderate sleep, intense dreams, sharp mind, perfectionist/irritable",
    kaphaTrait: "Deep, long sleep, calm, forgiving, slow to anger"
  }
];

export const DASHAVIDHA_EXPLANATIONS = {
  prakriti: "Constitutional assessment based on Tridoshas (Vata, Pitta, Kapha) at birth.",
  vikriti: "Current state of doshic imbalance or morbidity causing active disease.",
  sara: "Quality and excellence of the seven Dhatus (Rasa, Rakta, Mamsa, Meda, Asthi, Majja, Shukra).",
  samhanana: "Compactness and symmetry of the skeletal and muscular body structure.",
  pramana: "Anthropometric measurement and bodily proportions.",
  satmya: "Adaptability and tolerance to various foods, climates, and therapeutic regimens.",
  sattva: "Psychological stamina and emotional resilience under pain and distress.",
  aharaShakti: "Capacity for food ingestion (Abhyavaharana) and digestive breakdown (Jarana).",
  vyayamaShakti: "Capacity for physical exertion, work endurance, and exercise.",
  vaya: "Chronological age category (Bala, Madhyama, Vriddha) governing physiological reserves."
};

export const ASHTAVIDHA_PARIKSHA_LABELS = [
  { key: "nadi", label: "Nadi (Pulse)", hi: "नाड़ी परीक्षा" },
  { key: "mutra", label: "Mutra (Urine)", hi: "मूत्र परीक्षा" },
  { key: "mala", label: "Mala (Stool)", hi: "मल परीक्षा" },
  { key: "jihva", label: "Jihva (Tongue)", hi: "जिह्वा परीक्षा" },
  { key: "shabda", label: "Shabda (Voice/Speech)", hi: "शब्द परीक्षा" },
  { key: "sparsha", label: "Sparsha (Skin/Touch)", hi: "स्पर्श परीक्षा" },
  { key: "drik", label: "Drik (Eyes/Vision)", hi: "दृक् परीक्षा" },
  { key: "akriti", label: "Akriti (Gait/Posture)", hi: "आकृति परीक्षा" }
];
