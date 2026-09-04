import { NextRequest, NextResponse } from "next/server";
import { generateAbdmFhirBundle } from "@/lib/fhirBuilder";
import { PatientIntakeState } from "@/types/intake";

export async function POST(req: NextRequest) {
  try {
    const intake: PatientIntakeState = await req.json();

    if (!intake || !intake.patient) {
      return NextResponse.json(
        { error: "Invalid patient intake payload" },
        { status: 400 }
      );
    }

    const bundle = generateAbdmFhirBundle(intake);

    return NextResponse.json({
      success: true,
      bundle
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate ABDM FHIR Bundle" },
      { status: 500 }
    );
  }
}
