import { NextRequest, NextResponse } from "next/server";
import { parseMedicalText } from "@/lib/ocrExtractor";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body.text || "";

    if (!text) {
      return NextResponse.json(
        { error: "Missing document text for OCR parsing" },
        { status: 400 }
      );
    }

    const extractionResult = parseMedicalText(text);

    return NextResponse.json({
      success: true,
      data: extractionResult
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to parse medical document" },
      { status: 500 }
    );
  }
}
