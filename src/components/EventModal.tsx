
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarEvent } from '@/types';
import { formatDate } from '@/utils/dateUtils';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'> | CalendarEvent) => void;
  initialEvent?: Partial<CalendarEvent>;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEvent,
}) => {
  const [event, setEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    color: '#8B5CF6',
  });

  useEffect(() => {
    if (initialEvent) {
      setEvent({ ...event, ...initialEvent });
    }
  }, [initialEvent, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!event.title || !event.date) {
      return;
    }

    onSave(event as Omit<CalendarEvent, 'id'>);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialEvent?.id ? 'Edit Event' : 'Add Event'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Input
              name="title"
              placeholder="Event title"
              value={event.title || ''}
              onChange={handleChange}
              className="mb-2"
            />
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Date</p>
            <p className="text-sm text-gray-500">
              {event.date ? formatDate(event.date) : 'Select a date'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium mb-1">Start Time</p>
              <Input
                name="startTime"
                type="time"
                value={event.startTime || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">End Time</p>
              <Input
                name="endTime"
                type="time"
                value={event.endTime || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Description</p>
            <Textarea
              name="description"
              placeholder="Event description"
              value={event.description || ''}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Color</p>
            <div className="flex gap-2">
              {['#8B5CF6', '#F97316', '#10B981', '#0EA5E9', '#EC4899'].map((color) => (
                <div
                  key={color}
                  className={`w-8 h-8 rounded-full cursor-pointer ${
                    event.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setEvent((prev) => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!event.title}>
            {initialEvent?.id ? 'Update' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
