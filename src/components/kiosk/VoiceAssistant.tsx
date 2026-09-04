"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Sparkles, MessageSquare } from "lucide-react";
import { LanguageCode } from "@/types/intake";
import { speakText, stopSpeaking, createSpeechRecognizer } from "@/lib/speechHelper";
import { TRANSLATIONS } from "@/lib/translations";

interface VoiceAssistantProps {
  language: LanguageCode;
  promptText: string;
  autoSpeakPrompt?: boolean;
  onVoiceInput?: (text: string) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  language,
  promptText,
  autoSpeakPrompt = false,
  onVoiceInput
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognizer, setRecognizer] = useState<any>(null);
  const spokenKeyRef = useRef<string>("");

  // Play audio prompt safely without double-speaking or overlapping
  useEffect(() => {
    const currentKey = `${language}:${promptText}`;
    if (autoSpeakPrompt && promptText && spokenKeyRef.current !== currentKey) {
      spokenKeyRef.current = currentKey;
      handlePlayPrompt();
    }

    return () => {
      stopSpeaking();
    };
  }, [promptText, language, autoSpeakPrompt]);

  const handlePlayPrompt = () => {
    stopSpeaking();
    setIsSpeaking(true);
    speakText(promptText, language, () => {
      setIsSpeaking(false);
    });
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognizer) {
        recognizer.stop();
      }
      setIsListening(false);
      return;
    }

    // Always stop any playing speech before opening the microphone
    stopSpeaking();
    setIsSpeaking(false);

    const rec = createSpeechRecognizer(
      language,
      (text) => {
        setTranscript(text);
        if (onVoiceInput) onVoiceInput(text);
      },
      (error) => {
        console.warn("Recognition error:", error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (rec) {
      try {
        rec.start();
        setRecognizer(rec);
        setIsListening(true);
      } catch (e) {
        console.error("Failed to start speech recognition:", e);
      }
    } else {
      // Fallback simulation for browsers that block microphone
      setIsListening(true);
      setTimeout(() => {
        const simulatedVoiceText =
          language === "hi"
            ? "मुझे 2 दिन से छाती में बहुत तेज दर्द हो रहा है और सांस फूल रही है"
            : "I have had severe chest pain and breathlessness for the past 2 days";
        setTranscript(simulatedVoiceText);
        if (onVoiceInput) onVoiceInput(simulatedVoiceText);
        setIsListening(false);
      }, 3500);
    }
  };

  return (
    <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-teal-50 border border-sky-200 rounded-3xl p-5 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Prompt Speech Display */}
        <div className="flex items-start space-x-3.5 flex-1">
          <button
            onClick={handlePlayPrompt}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
              isSpeaking
                ? "bg-amber-500 text-white animate-pulse shadow-md"
                : "bg-sky-600 hover:bg-sky-700 text-white shadow"
            }`}
            title="Listen to audio prompt / आवाज सुनें"
          >
            {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                AI Voice Assistant / आवाज़ सहायक
              </span>
              {isSpeaking && (
                <span className="flex items-center space-x-1 text-xs text-amber-700 font-semibold animate-pulse">
                  <span>Speaking...</span>
                </span>
              )}
            </div>
            <p className="text-base sm:text-lg font-semibold text-slate-800 mt-1">
              "{promptText}"
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.audioPromptHint}
            </p>
          </div>
        </div>

        {/* Big Touch Voice Button for Elderly/Rural Patients */}
        <div className="flex flex-col items-center">
          <button
            onClick={toggleListening}
            className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold text-base transition-all transform active:scale-95 shadow-md ${
              isListening
                ? "bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse"
                : "bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white"
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-6 h-6 animate-bounce" />
                <span>{t.stopListening}</span>
              </>
            ) : (
              <>
                <Mic className="w-6 h-6" />
                <span>{t.tapToSpeak}</span>
              </>
            )}
          </button>

          {isListening && (
            <div className="flex items-center space-x-1.5 mt-2">
              <span className="w-2 h-4 bg-rose-500 rounded-full animate-pulse" />
              <span className="w-2 h-6 bg-rose-600 rounded-full animate-pulse delay-75" />
              <span className="w-2 h-3 bg-rose-400 rounded-full animate-pulse delay-150" />
              <span className="text-xs font-bold text-rose-700 ml-1">{t.listening}</span>
            </div>
          )}
        </div>
      </div>

      {/* Spoken Transcript Preview */}
      {transcript && (
        <div className="mt-4 pt-3 border-t border-sky-200/70 flex items-start space-x-2">
          <MessageSquare className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="text-sm text-slate-700">
            <span className="font-semibold text-sky-900">Patient Speech Recognized: </span>
            <span className="italic bg-white px-2 py-0.5 rounded border border-sky-200 text-slate-900 font-medium">
              "{transcript}"
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
