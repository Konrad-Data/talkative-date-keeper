
import React, { useState, useEffect } from 'react';
import { getDaysInMonth, isSameDay } from '@/utils/dateUtils';
import { useEvents } from '@/context/EventContext';
import EventCard from './EventCard';

const Calendar = ({ onDateSelect }: { onDateSelect: (date: Date) => void }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const { getEventsByDate } = useEvents();

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    setCalendarDays(getDaysInMonth(year, month));
  }, [currentDate]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const eventsForDate = getEventsByDate(selectedDate);

  return (
    <div className="rounded-lg bg-white shadow-md overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 bg-purple-600 text-white flex justify-between items-center">
        <button 
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-purple-700 rounded"
        >
          &lt;
        </button>
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button 
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-purple-700 rounded"
        >
          &gt;
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 bg-purple-50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-2 text-center text-sm font-medium text-purple-900">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 bg-white">
        {calendarDays.map((date, i) => {
          const dayEvents = getEventsByDate(date);
          const hasEvents = dayEvents.length > 0;
          
          return (
            <div
              key={i}
              onClick={() => handleDateClick(date)}
              className={`
                h-16 p-1 border border-gray-100 relative cursor-pointer
                ${isCurrentMonth(date) ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                ${isSameDay(date, selectedDate) ? 'ring-2 ring-purple-600' : ''}
                ${isToday(date) ? 'font-bold' : ''}
                hover:bg-purple-50
              `}
            >
              <span className={`text-sm ${isToday(date) ? 'bg-purple-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : ''}`}>
                {date.getDate()}
              </span>
              
              {hasEvents && (
                <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-orange-500"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Date Events */}
      <div className="p-4 bg-purple-50 max-h-64 overflow-auto">
        <h3 className="font-medium text-purple-900 mb-2">
          {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>
        
        <div className="space-y-2">
          {eventsForDate.length > 0 ? (
            eventsForDate.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No events scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
