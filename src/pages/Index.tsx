
import React, { useState } from 'react';
import Calendar from '@/components/Calendar';
import VoiceInput from '@/components/VoiceInput';
import EventModal from '@/components/EventModal';
import { Button } from '@/components/ui/button';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { CalendarEvent } from '@/types';
import { useEvents } from '@/context/EventContext';
import { EventProvider } from '@/context/EventContext';

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
    <div className="min-h-screen bg-purple-50">
      <header className="bg-purple-600 text-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-6 w-6" />
            <h1 className="text-xl font-bold">Voice Calendar</h1>
          </div>
          <Button
            variant="secondary"
            className="bg-white text-purple-600 hover:bg-purple-100"
            onClick={handleAddEvent}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Event
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-6">
            <VoiceInput onRecognitionResult={handleVoiceResult} />
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-2">Voice Commands</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• "Add meeting with John tomorrow at 2pm"</li>
                <li>• "Schedule doctor appointment on Friday at 3pm"</li>
                <li>• "Create team lunch next Monday at 12:30pm"</li>
                <li>• "Add dentist visit on April 15th at 10am"</li>
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
