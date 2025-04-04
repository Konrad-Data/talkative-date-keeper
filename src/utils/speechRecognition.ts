
interface SpeechRecognitionResult {
  text: string;
  isFinal: boolean;
}

// Define SpeechRecognition types for TypeScript
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

// Add SpeechRecognition to the window interface
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const startSpeechRecognition = (
  onResult: (result: { text: string; isFinal: boolean }) => void,
  onError?: (error: string) => void,
  onEnd?: () => void
): (() => void) => {
  // Check if browser supports speech recognition
  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognitionClass) {
    if (onError) onError('Speech recognition not supported in this browser');
    return () => {};
  }
  
  const recognition = new SpeechRecognitionClass();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  
  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    if (finalTranscript) {
      onResult({ text: finalTranscript, isFinal: true });
    } else if (interimTranscript) {
      onResult({ text: interimTranscript, isFinal: false });
    }
  };
  
  recognition.onerror = (event) => {
    if (onError) onError(event.error);
  };
  
  recognition.onend = () => {
    if (onEnd) onEnd();
  };
  
  recognition.start();
  
  return () => {
    recognition.stop();
  };
};
