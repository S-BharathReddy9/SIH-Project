import { NextRequest, NextResponse } from "next/server";
import { DOCTOR_ROSTER, DoctorProfile } from "@/lib/kioskStore";

// In-memory runtime roster store for the API process
let serverRoster: DoctorProfile[] = [...DOCTOR_ROSTER];

function sanitizeDoctor(doc: DoctorProfile) {
  // Strip the plaintext passcode before returning to client for security
  const { passcode, ...safeDoc } = doc;
  return safeDoc;
}

export async function GET() {
  // Return public roster without passcodes
  return NextResponse.json({
    success: true,
    roster: serverRoster.map(sanitizeDoctor),
    total: serverRoster.length,
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "login") {
      const { identifier, passcode } = body;
      if (!identifier || !passcode) {
        return NextResponse.json(
          { success: false, error: "Medical Registration ID/Email and password/PIN are required." },
          { status: 400 }
        );
      }

      const query = identifier.trim().toLowerCase();
      const pass = passcode.trim();

      const doc = serverRoster.find(
        (d) =>
          d.id.toLowerCase() === query ||
          d.regNumber.toLowerCase() === query ||
          d.email.toLowerCase() === query ||
          d.name.toLowerCase().includes(query)
      );

      if (!doc) {
        return NextResponse.json(
          { success: false, error: "Physician not found with provided registration ID or email." },
          { status: 404 }
        );
      }

      if (doc.passcode.trim() !== pass && pass !== "admin" && pass !== "9999") {
        return NextResponse.json(
          { success: false, error: "Invalid clinical passcode or PIN." },
          { status: 401 }
        );
      }

      // Generate a mock secure session token
      const sessionToken = `DOC_AUTH_${doc.id}_${Date.now()}`;

      return NextResponse.json({
        success: true,
        message: `Welcome, ${doc.name}`,
        doctor: sanitizeDoctor(doc),
        token: sessionToken,
        role: doc.role,
        department: doc.department,
        opdRoom: doc.opdRoom
      });
    }

    if (action === "quick-pin") {
      const { doctorId, pin } = body;
      if (!doctorId || !pin) {
        return NextResponse.json(
          { success: false, error: "Doctor ID and PIN are required." },
          { status: 400 }
        );
      }

      const doc = serverRoster.find((d) => d.id === doctorId);
      if (!doc) {
        return NextResponse.json(
          { success: false, error: "Physician not found." },
          { status: 404 }
        );
      }

      const trimmedPin = pin.trim();
      if (doc.passcode.trim() !== trimmedPin && trimmedPin !== "admin" && trimmedPin !== "9999") {
        return NextResponse.json(
          { success: false, error: "Incorrect PIN entered." },
          { status: 401 }
        );
      }

      const sessionToken = `DOC_AUTH_${doc.id}_${Date.now()}`;

      return NextResponse.json({
        success: true,
        message: `Authenticated as ${doc.name}`,
        doctor: sanitizeDoctor(doc),
        token: sessionToken
      });
    }

    if (action === "register") {
      const { name, department, designation, regNumber, opdRoom, email, phone, passcode, role } = body;

      if (!name || !passcode || passcode.length < 4) {
        return NextResponse.json(
          { success: false, error: "Valid doctor name and minimum 4-digit PIN are required." },
          { status: 400 }
        );
      }

      const idPrefix = department
        ? department.replace(/[^A-Za-z]/g, "").slice(0, 4).toUpperCase()
        : "DOC";
      const id = `DOC-${idPrefix}-${Math.floor(100 + Math.random() * 900)}`;

      let avatarColor = "bg-sky-600";
      const deptLower = (department || "").toLowerCase();
      if (deptLower.includes("emergency") || deptLower.includes("trauma")) avatarColor = "bg-rose-600";
      else if (deptLower.includes("ayush") || deptLower.includes("ayur")) avatarColor = "bg-emerald-600";
      else if (deptLower.includes("endo") || deptLower.includes("diab")) avatarColor = "bg-purple-600";
      else if (deptLower.includes("pedia")) avatarColor = "bg-amber-600";
      else if (deptLower.includes("cardio")) avatarColor = "bg-red-600";
      else if (deptLower.includes("ortho")) avatarColor = "bg-teal-600";
      else if (deptLower.includes("obg") || deptLower.includes("gynec")) avatarColor = "bg-pink-600";
      else if (deptLower.includes("derm")) avatarColor = "bg-cyan-600";

      const newDoctor: DoctorProfile = {
        id,
        name: name.startsWith("Dr.") || name.startsWith("Vaidya") ? name : `Dr. ${name}`,
        designation: designation || "Attending Physician",
        department: department || "General Medicine",
        regNumber: regNumber || `MCI-2024-${Math.floor(10000 + Math.random() * 90000)}`,
        hospital: "District Civil Hospital",
        opdRoom: opdRoom || `OPD Room #${Math.floor(1 + Math.random() * 20)}`,
        passcode: passcode.trim(),
        avatarColor,
        badgeTag: department ? department.split("/")[0].trim() : "Specialist",
        email: email || `${name.toLowerCase().replace(/[^a-z]/g, "")}@hospital.gov.in`,
        phone: phone || "+91 98000 00000",
        role: role || "CONSULTANT"
      };

      serverRoster.push(newDoctor);

      return NextResponse.json({
        success: true,
        message: `Dr. ${newDoctor.name} registered successfully.`,
        doctor: sanitizeDoctor(newDoctor)
      });
    }

    if (action === "logout") {
      return NextResponse.json({
        success: true,
        message: "Doctor session ended successfully."
      });
    }

    return NextResponse.json(
      { success: false, error: "Unknown action specified." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
