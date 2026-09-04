// ABDM FHIR R4 Compliant Types for MediKiosk Digital Clinical Intake
export interface FhirIdentifier {
  system: string;
  value: string;
}

export interface FhirCodeableConcept {
  coding: {
    system: string;
    code: string;
    display: string;
  }[];
  text?: string;
}

export interface FhirQuantity {
  value: number;
  unit: string;
  system?: string;
  code?: string;
}

export interface FhirResourceHeader {
  resourceType: string;
  id: string;
  meta?: {
    versionId?: string;
    lastUpdated: string;
    profile?: string[];
  };
}

export interface FhirPatientResource extends FhirResourceHeader {
  resourceType: "Patient";
  identifier: FhirIdentifier[];
  name: {
    text: string;
    family?: string;
    given?: string[];
  }[];
  gender: "male" | "female" | "other" | "unknown";
  birthDate?: string;
}

export interface FhirEncounterResource extends FhirResourceHeader {
  resourceType: "Encounter";
  status: "planned" | "arrived" | "triaged" | "in-progress" | "finished";
  class: {
    system: string;
    code: "AMB" | "EMER";
    display: string;
  };
  subject: {
    reference: string;
    display: string;
  };
  period: {
    start: string;
  };
}

export interface FhirConditionResource extends FhirResourceHeader {
  resourceType: "Condition";
  clinicalStatus: {
    coding: {
      system: string;
      code: "active" | "recurrence" | "relapse" | "remission" | "resolved";
    }[];
  };
  verificationStatus?: {
    coding: {
      system: string;
      code: "provisional" | "confirmed";
    }[];
  };
  code: FhirCodeableConcept;
  subject: {
    reference: string;
  };
}

export interface FhirObservationResource extends FhirResourceHeader {
  resourceType: "Observation";
  status: "preliminary" | "final";
  code: FhirCodeableConcept;
  subject: {
    reference: string;
  };
  effectiveDateTime: string;
  valueQuantity?: FhirQuantity;
  valueString?: string;
  interpretation?: FhirCodeableConcept[];
  referenceRange?: {
    text?: string;
  }[];
}

export interface FhirMedicationStatementResource extends FhirResourceHeader {
  resourceType: "MedicationStatement";
  status: "active" | "completed";
  medicationCodeableConcept: FhirCodeableConcept;
  subject: {
    reference: string;
  };
  dosage?: {
    text: string;
  }[];
}

export interface FhirBundle {
  resourceType: "Bundle";
  id: string;
  meta: {
    lastUpdated: string;
    profile: string[];
  };
  identifier: FhirIdentifier;
  type: "document" | "collection" | "transaction";
  timestamp: string;
  entry: {
    fullUrl: string;
    resource: any;
  }[];
}
