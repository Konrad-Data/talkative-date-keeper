
import React, { useState } from 'react';
import Calendar from '@/components/Calendar';
import VoiceInput from '@/components/VoiceInput';
import EventModal from '@/components/EventModal';
import { Button } from '@/components/ui/button';
import { Plus, Calendar as CalendarIcon, Moon, Download } from 'lucide-react';
import { CalendarEvent } from '@/types';
import { useEvents } from '@/context/EventContext';
import { EventProvider } from '@/context/EventContext';
import { Toaster } from '@/components/ui/sonner';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<CalendarEvent> | undefined>(undefined);
  
  return (
    <EventProvider>
      <AppContent 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        currentEvent={currentEvent}
        setCurrentEvent={setCurrentEvent}
      />
    </EventProvider>
  );
};

const AppContent = ({ 
  selectedDate, 
  setSelectedDate,
  isModalOpen,
  setIsModalOpen,
  currentEvent,
  setCurrentEvent
}: {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  currentEvent: Partial<CalendarEvent> | undefined;
  setCurrentEvent: (event: Partial<CalendarEvent> | undefined) => void;
}) => {
  const { addEvent, updateEvent } = useEvents();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleVoiceResult = (result: {
    title: string;
    date: Date;
    startTime?: string;
    endTime?: string;
    description?: string;
  }) => {
    setCurrentEvent(result);
    setIsModalOpen(true);
  };

  const handleAddEvent = () => {
    setCurrentEvent({ date: selectedDate });
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: Omit<CalendarEvent, 'id'> | CalendarEvent) => {
    if ('id' in event) {
      updateEvent(event as CalendarEvent);
    } else {
      addEvent(event as Omit<CalendarEvent, 'id'>);
    }
    setCurrentEvent(undefined);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEvent(undefined);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-gradient-to-r from-primary to-accent/70 text-white p-4 md:p-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold glow">Voice Calendar</h1>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10"
              onClick={handleAddEvent}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Event
            </Button>
            <a 
              href="https://capacitorjs.com/solution/android" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                <Download className="h-4 w-4 mr-1" /> Get App
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-6">
            <VoiceInput onRecognitionResult={handleVoiceResult} />
            <div className="glass-card rounded-xl p-4 shadow-lg border border-accent/20 glow-border">
              <h3 className="font-medium text-primary mb-3">Voice Commands</h3>
              <ul className="text-sm text-foreground/80 space-y-2">
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>"Add meeting with John tomorrow at 2pm"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>"Schedule doctor appointment on Friday at 3pm"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>"Create team lunch next Monday at 12:30pm"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>"Add dentist visit on April 15th at 10am"</span>
                </li>
              </ul>
            </div>
          </div>
          
          <Calendar onDateSelect={handleDateSelect} />
        </div>
      </main>

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        initialEvent={currentEvent}
      />
    </div>
  );
};

export default Index;
