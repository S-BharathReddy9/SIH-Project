"use client";

import React, { useEffect, useState } from "react";
import { RedFlagAlert, LanguageCode } from "@/types/intake";
import { ShieldAlert, AlertOctagon, PhoneCall, HeartPulse, Check, Volume2 } from "lucide-react";
import { speakText } from "@/lib/speechHelper";

interface RedFlagAlertModalProps {
  alert: RedFlagAlert;
  language: LanguageCode;
  onAcknowledge: () => void;
}

export const RedFlagAlertModal: React.FC<RedFlagAlertModalProps> = ({
  alert,
  language,
  onAcknowledge
}) => {
  const isHi = language === "hi";
  const [attendantNotified, setAttendantNotified] = useState(false);

  useEffect(() => {
    // Speak audio alert warning immediately
    const spokenWarning = isHi
      ? "चेतावनी! गंभीर आपातकालीन लक्षण पाए गए हैं। कृपया शांत रहें, अस्पताल की इमरजेंसी टीम को सूचित कर दिया गया है।"
      : "Emergency Alert! Critical symptoms detected. Please remain seated, the hospital emergency team has been alerted.";
    speakText(spokenWarning, language);
  }, []);

  const handleNotifyStaff = () => {
    setAttendantNotified(true);
    setTimeout(() => {
      onAcknowledge();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white border-4 border-rose-600 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Flashing Red Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 animate-pulse" />

        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 border-2 border-rose-300 text-rose-600 flex items-center justify-center shrink-0 animate-bounce">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div className="flex-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              <span>CODE RED EMERGENCY TRIAGE</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-2">
              {alert.title}
            </h3>

            <p className="text-sm text-slate-700 mt-2 font-medium leading-relaxed">
              {alert.description}
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm font-semibold">
              <span className="font-bold block text-rose-950 mb-1">
                {isHi ? "तत्काल चिकित्सा निर्देश:" : "Immediate Resuscitation Action:"}
              </span>
              {alert.actionRequired}
            </div>

            {/* Token Notification */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-rose-400 font-bold uppercase tracking-wider block">
                  Priority Green-Channel Token
                </span>
                <span className="text-2xl font-black text-white">EMERGENCY-01</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-300 block">Routing To:</span>
                <span className="text-sm font-bold text-amber-400">ER / Resuscitation Bay #1</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleNotifyStaff}
                disabled={attendantNotified}
                className="flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-2xl font-black text-base bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 transition-all transform active:scale-95"
              >
                {attendantNotified ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>{isHi ? "स्टाफ अलर्ट भेजा गया!" : "Emergency Attendant Dispatched!"}</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-5 h-5" />
                    <span>{isHi ? "आपातकालीन सहायक को बुलाएं" : "Dispatch Emergency Attendant"}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onAcknowledge}
                className="py-4 px-6 rounded-2xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {isHi ? "जारी रखें (Doctor Desk Alert)" : "Acknowledge & View Desk Summary"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
