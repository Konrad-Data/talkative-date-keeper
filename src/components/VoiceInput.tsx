
import React, { useState, useEffect } from 'react';
import { startSpeechRecognition } from '@/utils/speechRecognition';
import { parseVoiceInput } from '@/utils/dateUtils';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface VoiceInputProps {
  onRecognitionResult: (result: {
    title: string;
    date: Date;
    startTime?: string;
    endTime?: string;
    description?: string;
  }) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onRecognitionResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let stopListening: (() => void) | null = null;

    if (isListening) {
      stopListening = startSpeechRecognition(
        (result) => {
          setTranscript(result.text);
          
          if (result.isFinal) {
            handleFinalTranscript(result.text);
          }
        },
        (error) => {
          toast({
            title: 'Speech Recognition Error',
            description: error,
            variant: 'destructive',
          });
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
    }

    return () => {
      if (stopListening) {
        stopListening();
      }
    };
  }, [isListening, toast]);

  const handleFinalTranscript = (text: string) => {
    setIsParsing(true);
    setTimeout(() => {
      const parsedEvent = parseVoiceInput(text);
      
      if (parsedEvent) {
        onRecognitionResult(parsedEvent);
        toast({
          title: 'Event Recognized',
          description: `"${parsedEvent.title}" on ${parsedEvent.date.toLocaleDateString()}`,
        });
      } else {
        toast({
          title: 'Could not understand',
          description: 'Try saying something like "Add meeting with John tomorrow at 2pm"',
          variant: 'destructive',
        });
      }
      
      setIsParsing(false);
      setIsListening(false);
      setTranscript('');
    }, 1000);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (isListening) {
      setTranscript('');
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <Button 
        className={`w-16 h-16 rounded-full ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-600 hover:bg-purple-700'}`}
        onClick={toggleListening}
        disabled={isParsing}
      >
        {isParsing ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : isListening ? (
          <MicOff className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>
      
      <div className="h-20 w-full">
        {isListening && (
          <div className="text-sm font-medium text-purple-900 p-2 bg-purple-50 rounded-md w-full h-full overflow-auto">
            {transcript || "Listening..."}
          </div>
        )}
        
        {!isListening && !isParsing && (
          <div className="text-center text-gray-500 text-sm p-4">
            Tap the microphone and say something like:<br />
            "Add meeting with John tomorrow at 2pm"
          </div>
        )}
        
        {isParsing && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
            <span className="ml-2 text-sm text-purple-600">Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;
