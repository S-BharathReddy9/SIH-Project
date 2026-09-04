import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediKiosk - AI-Powered Digital Clinical Intake & ABDM Triage System",
  description: "Next-generation patient self-service kiosk & clinical intake assistant for Indian and AYUSH Hospital OPDs. Featuring multilingual voice/touch intake, ABDM ABHA integration, document OCR, SOCRATES pain analysis, and Dashavidha Pariksha.",
};

import { DoctorAuthProvider } from "@/components/doctor/DoctorAuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <DoctorAuthProvider>
          {children}
        </DoctorAuthProvider>
      </body>
    </html>
  );
}
