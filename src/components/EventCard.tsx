
import React from 'react';
import { CalendarEvent } from '@/types';
import { Card } from '@/components/ui/card';
import { Clock, MoreVertical } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useEvents } from '@/context/EventContext';

interface EventCardProps {
  event: CalendarEvent;
  onEdit?: (event: CalendarEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit }) => {
  const { deleteEvent } = useEvents();

  return (
    <Card 
      className="p-3 shadow-sm"
      style={{ borderLeft: `4px solid ${event.color || '#8B5CF6'}` }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900">{event.title}</h4>
          
          {(event.startTime || event.endTime) && (
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {event.startTime && event.endTime
                ? `${event.startTime} - ${event.endTime}`
                : event.startTime || event.endTime}
            </p>
          )}
          
          {event.description && (
            <p className="text-xs text-gray-600 mt-2 line-clamp-2">{event.description}</p>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(event)}>
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              className="text-red-600" 
              onClick={() => deleteEvent(event.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};

export default EventCard;
