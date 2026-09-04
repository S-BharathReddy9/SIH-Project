import { PatientIntakeState } from "@/types/intake";
import { FhirBundle } from "@/types/fhir";

export function generateAbdmFhirBundle(intake: PatientIntakeState): FhirBundle {
  const patientId = intake.patient.id || `pt-${Date.now()}`;
  const encounterId = `enc-${Date.now()}`;
  const nowIso = new Date().toISOString();
  const entries: any[] = [];

  // 1. Patient Resource
  const patientResource = {
    fullUrl: `urn:uuid:${patientId}`,
    resource: {
      resourceType: "Patient",
      id: patientId,
      meta: {
        lastUpdated: nowIso,
        profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Patient"]
      },
      identifier: [
        {
          system: "https://healthid.ndhm.gov.in",
          value: intake.patient.abhaId || "ABHA-PENDING-REG"
        }
      ],
      name: [
        {
          text: intake.patient.name,
          given: [intake.patient.name]
        }
      ],
      gender: intake.patient.gender.toLowerCase(),
      telecom: intake.patient.phone
        ? [
            {
              system: "phone",
              value: intake.patient.phone
            }
          ]
        : []
    }
  };
  entries.push(patientResource);

  // 2. Encounter Resource
  const isEmergency = intake.patient.triageCategory === "Emergency";
  const encounterResource = {
    fullUrl: `urn:uuid:${encounterId}`,
    resource: {
      resourceType: "Encounter",
      id: encounterId,
      meta: {
        lastUpdated: nowIso,
        profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Encounter"]
      },
      status: isEmergency ? "triaged" : "arrived",
      class: {
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: isEmergency ? "EMER" : "AMB",
        display: isEmergency ? "Emergency Triage Encounter" : "Ambulatory OPD Check-In"
      },
      subject: {
        reference: `urn:uuid:${patientId}`,
        display: intake.patient.name
      },
      period: {
        start: intake.patient.intakeTimestamp || nowIso
      }
    }
  };
  entries.push(encounterResource);

  // 3. Chief Complaint / Condition Resources
  intake.chiefComplaints.forEach((cc, idx) => {
    const conditionId = `cond-${Date.now()}-${idx}`;
    entries.push({
      fullUrl: `urn:uuid:${conditionId}`,
      resource: {
        resourceType: "Condition",
        id: conditionId,
        meta: {
          lastUpdated: nowIso,
          profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Condition"]
        },
        clinicalStatus: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
              code: "active"
            }
          ]
        },
        verificationStatus: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
              code: "provisional"
            }
          ]
        },
        code: {
          text: `${cc.symptom} (Duration: ${cc.duration}, Severity: ${cc.severity})`
        },
        subject: {
          reference: `urn:uuid:${patientId}`
        }
      }
    });
  });

  // 4. Observations (Lab Tests from scanned documents)
  intake.scannedDocuments.forEach((doc) => {
    (doc.extractedLabTests || []).forEach((lab: any, lIdx: number) => {
      const obsId = `obs-${Date.now()}-${lIdx}`;
      entries.push({
        fullUrl: `urn:uuid:${obsId}`,
        resource: {
          resourceType: "Observation",
          id: obsId,
          meta: {
            lastUpdated: nowIso,
            profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Observation"]
          },
          status: "final",
          code: {
            text: lab.testName
          },
          subject: {
            reference: `urn:uuid:${patientId}`
          },
          effectiveDateTime: lab.testDate || nowIso,
          valueQuantity: {
            value: typeof lab.value === "number" ? lab.value : parseFloat(lab.value) || 0,
            unit: lab.unit
          },
          interpretation: [
            {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                  code: lab.status === "High" ? "H" : lab.status === "Low" ? "L" : "N",
                  display: lab.status
                }
              ]
            }
          ],
          referenceRange: [
            {
              text: lab.referenceRange
            }
          ]
        }
      });
    });
  });

  // 5. Medication Statements
  intake.currentMedications.forEach((medName, mIdx) => {
    const medId = `med-${Date.now()}-${mIdx}`;
    entries.push({
      fullUrl: `urn:uuid:${medId}`,
      resource: {
        resourceType: "MedicationStatement",
        id: medId,
        meta: {
          lastUpdated: nowIso,
          profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/MedicationStatement"]
        },
        status: "active",
        medicationCodeableConcept: {
          text: medName
        },
        subject: {
          reference: `urn:uuid:${patientId}`
        }
      }
    });
  });

  // 6. Complete Bundle
  const bundle: FhirBundle = {
    resourceType: "Bundle",
    id: `bundle-medikiosk-${Date.now()}`,
    meta: {
      lastUpdated: nowIso,
      profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle"]
    },
    identifier: {
      system: "https://medikiosk.gov.in/bundles",
      value: `MK-${intake.patient.opdToken || "GEN"}-${Date.now()}`
    },
    type: "document",
    timestamp: nowIso,
    entry: entries
  };

  return bundle;
}
