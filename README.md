# MediKiosk: AI-Powered Digital Clinical Intake & Triage System

**A Smart India Hackathon (SIH) Solution for Indian Government & AYUSH Hospital OPDs**

MediKiosk solves the **first-mile clinical intake problem** under the **Ayushman Bharat Digital Mission (ABDM)**. In high-density Indian public hospital Outpatient Departments (OPDs), doctors are limited to only 2–5 minutes per patient. MediKiosk empowers patients to complete adaptive, multilingual clinical history-taking, scan and digitize paper prescriptions and lab reports via AI OCR, and deliver a structured 60-second summary to the doctor before consultation.

---

## 🌟 Key Capabilities

### 1. Module A – Conversational History Engine
- **Voice + Touch Multilingual Accessibility**: Supports Hindi (हिंदी), English, Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), and Bengali (বাংলা). High-contrast UI with large touch targets for elderly and low-literacy users.
- **SOCRATES Protocol**: Adaptive interrogation of Site, Onset, Character, Radiation, Associations, Time course, Exacerbating/relieving factors, and Severity (1-10 VAS).
- **AYUSH & Ayurveda Integration**: Captures **Dashavidha Pariksha** (Prakriti Tridosha scores, Vikriti, Sara, Samhanana, Pramana, Satmya, Sattva, Ahara-shakti, Vyayama-shakti, Vaya), **Agni** (Manda, Tikshna, Vishama, Sama), **Koshtha** (Krura, Mrudu, Madhyama), and **Ahara-Vihara** causative factors (Nidana).
- **Red-Flag Emergency Triage**: Real-time detection of Acute Coronary Syndrome (STEMI), FAST Stroke signs, severe respiratory failure, or acute peritonitis, triggering an instant visual/audio alert and issuing a Priority Green-Channel Token (`EMERGENCY-01`).

### 2. Module B – Medical Document Digitization
- **AI OCR & Medical NER**: Reads handwritten and printed doctor prescriptions, lab test reports (Complete Blood Count, Lipid profile, Blood sugar), and discharge summaries.
- **Abnormal Value Flagging**: Automatically benchmarks extracted values against normal biological reference ranges (e.g. Hemoglobin 8.2 g/dL [Severely Low], Fasting Blood Sugar 215 mg/dL [High]).
- **Drug-Drug Interaction Alerts**: Flags potential contraindications (e.g., Aspirin + Ibuprofen ulceration risk).
- **Chronological Health Timeline**: Organizes chaotic historical documents into an ordered timeline.

### 3. Module C – Structured History Summary (Doctor's Desk)
- **60-Second Clinical Digest**: Chief complaints, HPI, past medical/surgical history, current medications, lab parameter trends, and AYUSH radar.
- **Doctor In-the-Loop Principle**: The AI never makes the final diagnosis. The doctor can read, edit, confirm, or reject any part of the summary.
- **Printable OPD Prescription Slip**: 1-click printable consultation sheet with QR code.

### 4. Module D – Consent, Privacy & ABDM Integration
- **ABHA Verification**: 14-digit ABHA validation, simulated QR card scanning, and OTP verification.
- **DPDP Act 2023 Compliance**: Audio-visual plain-language consent disclosure in native languages; temporary session data encryption and purging.
- **ABDM FHIR R4 Bundle Export**: 100% compliant HL7 FHIR R4 Bundle generator exporting `Patient`, `Encounter`, `Condition`, `Observation`, and `MedicationStatement` resources.
- **Multi-Doctor Care Partitioning**: Doctors log in to their department-specific queue (General Medicine, Emergency/Cardiology, AYUSH/Ayurveda, Endocrinology). By default, doctors only view patients assigned to them, with full referral and reassignment workflows.

---

### 👨‍⚕️ Available Doctor Accounts & Credentials

| Doctor Name | Department | Room | Default PIN |
| :--- | :--- | :--- | :--- |
| **Dr. A. K. Sharma** | General Medicine | OPD Room #4 | `1234` |
| **Dr. Rajesh Mehra** | Emergency & Resuscitation | Resuscitation Bay #1 | `2233` |
| **Vaidya Priya Nair** | AYUSH / Kayachikitsa | AYUSH Room #2 | `3344` |
| **Dr. Meenakshi Sundaram** | Endocrinology & Diabetes | Specialty Clinic #7 | `4455` |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
# Clone or navigate to the project directory
cd "c:/Home/SIH project"

# Install dependencies (already pre-installed)
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Patient Kiosk**: [http://localhost:3000/kiosk](http://localhost:3000/kiosk)
- **Doctor's Consultation Desk**: [http://localhost:3000/doctor](http://localhost:3000/doctor)

---

## 📋 Flagship Interactive Demonstration Cases

To evaluate the system during presentations or jury rounds, 3 pre-configured clinical cases are available on the home page:

1. **Ramesh Kumar (54M) - Emergency Red-Flag Triage**:
   - Symptoms: Severe crushing retrosternal chest pain radiating to left arm + diaphoresis.
   - Triggers: Code Red Emergency Siren and Priority Resuscitation Token `EMERGENCY-01`.
2. **Sunita Devi (48F) - Document OCR & Lab Anomaly**:
   - Symptoms: Chronic fatigue and burning soles with 3 scanned paper reports.
   - Triggers: OCR highlights Hemoglobin = 8.2 g/dL [Low] and FBS = 215 mg/dL [High] on medical timeline.
3. **Rajeshwari Sharma (42F) - AYUSH Dashavidha Pariksha**:
   - Symptoms: Chronic bilateral joint stiffness (Amavata).
   - Triggers: Vata-Kapha Prakriti, Manda Agni, Krura Koshtha, and Viruddha Ahara assessment.

---

## 🏛️ System Architecture

```
src/
├── app/
│   ├── layout.tsx              # Root Layout & Tailwind Theme
│   ├── page.tsx                # Role Switcher & SIH Demo Launch Hub
│   ├── kiosk/                  # Patient Kiosk Pages (Steps 1 to 5)
│   ├── doctor/                 # Doctor OPD Queue & Clinical Summary
│   └── api/                    # OCR Extraction & ABDM FHIR R4 APIs
├── components/
│   ├── kiosk/                  # VoiceAssistant, SocratesFlow, AyushAssessment, DocumentScanner, RedFlagAlertModal
│   └── doctor/                 # ClinicalSummaryView, DoctorHeader, FhirExportModal
├── data/
│   ├── samplePatients.ts       # 3 Flagship Indian clinical cases
│   ├── sampleDocuments.ts      # Authentic handwritten & printed medical documents
│   ├── medicalKnowledge.ts     # Normal lab ranges, red flags, drug interaction rules
│   └── ayushTaxonomy.ts        # Dashavidha Pariksha & Agni definitions
├── lib/
│   ├── fhirBuilder.ts          # ABDM FHIR R4 Bundle Constructor
│   ├── ocrExtractor.ts         # Medical NER & regex lab/drug parsing
│   ├── speechHelper.ts         # Web Speech API (TTS & Speech Recognition)
│   ├── translations.ts         # Multilingual translations (HI, EN, TA, TE, KN, BN)
│   └── kioskStore.ts           # Client-side session and queue persistence
└── types/                      # TypeScript definitions (intake, document, fhir, ayush)
```
