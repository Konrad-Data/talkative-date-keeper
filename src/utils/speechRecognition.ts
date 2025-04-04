
interface SpeechRecognitionResult {
  text: string;
  isFinal: boolean;
}

export const startSpeechRecognition = (
  onResult: (result: SpeechRecognitionResult) => void,
  onError?: (error: string) => void,
  onEnd?: () => void
): (() => void) => {
  // This is a browser-based implementation
  // For a native Android app, you would use the Android Speech Recognition API
  
  // Check if browser supports speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    if (onError) onError('Speech recognition not supported in this browser');
    return () => {};
  }
  
  const recognition = new SpeechRecognition();
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

// For Android app integrations, this would need to be replaced with
// React Native's native module implementation or a Capacitor plugin
