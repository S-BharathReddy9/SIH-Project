import { LanguageCode } from "@/types/intake";

export const LANGUAGE_LOCALE_MAP: Record<LanguageCode, string> = {
  en: "en-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  bn: "bn-IN"
};

// Global speech state to prevent overlapping or duplicate utterances
let activeUtterance: SpeechSynthesisUtterance | null = null;
let pendingSpeechTimer: any = null;
let lastSpeechRequest: { text: string; language: LanguageCode; timestamp: number } | null = null;

export const stopSpeaking = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    if (pendingSpeechTimer) {
      clearTimeout(pendingSpeechTimer);
      pendingSpeechTimer = null;
    }
    window.speechSynthesis.cancel();
    if (activeUtterance) {
      activeUtterance.onend = null;
      activeUtterance.onerror = null;
      activeUtterance = null;
    }
  }
};

export const speakText = (text: string, language: LanguageCode = "hi", onEnd?: () => void) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis is not supported in this browser environment.");
    if (onEnd) onEnd();
    return;
  }

  const trimmedText = text.trim();
  if (!trimmedText) {
    if (onEnd) onEnd();
    return;
  }

  // Prevent duplicate execution of the exact same speech request within 600ms (e.g. React StrictMode)
  const now = Date.now();
  if (
    lastSpeechRequest &&
    lastSpeechRequest.text === trimmedText &&
    lastSpeechRequest.language === language &&
    now - lastSpeechRequest.timestamp < 600
  ) {
    return;
  }
  lastSpeechRequest = { text: trimmedText, language, timestamp: now };

  // Always cancel any existing speech and queue cleanly
  stopSpeaking();

  // Small delay (75ms) allows Chromium/Windows audio subsystem to completely terminate previous stream
  pendingSpeechTimer = setTimeout(() => {
    pendingSpeechTimer = null;

    try {
      const utterance = new SpeechSynthesisUtterance(trimmedText);
      utterance.lang = LANGUAGE_LOCALE_MAP[language] || "en-IN";
      utterance.rate = 0.95; // Slightly slower for clear hospital listening
      utterance.pitch = 1.0;

      // Select matching voice for language if available
      const voices = window.speechSynthesis.getVoices();
      const targetLocale = LANGUAGE_LOCALE_MAP[language];
      const matchingVoice = voices.find(
        (v) =>
          v.lang.replace("_", "-").toLowerCase() === targetLocale.toLowerCase() ||
          v.lang.toLowerCase().startsWith(language.toLowerCase())
      );
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => {
        activeUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        // "interrupted" is common when user navigates or cancels; don't treat as critical error
        if (e.error !== "interrupted" && e.error !== "canceled") {
          console.warn("Speech synthesis error:", e.error);
        }
        activeUtterance = null;
        if (onEnd) onEnd();
      };

      // Keep reference to prevent Chromium garbage collection bug
      activeUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Failed to speak text:", err);
      activeUtterance = null;
      if (onEnd) onEnd();
    }
  }, 75);
};

export const createSpeechRecognizer = (
  language: LanguageCode,
  onResult: (transcript: string) => void,
  onError: (error: string) => void,
  onEnd: () => void
) => {
  if (typeof window === "undefined") return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn("SpeechRecognition API is not supported in this browser.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = LANGUAGE_LOCALE_MAP[language] || "hi-IN";
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onresult = (event: any) => {
    let current = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      current += event.results[i][0].transcript;
    }
    onResult(current);
  };

  recognition.onerror = (event: any) => {
    onError(event.error || "Speech recognition error");
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
};
