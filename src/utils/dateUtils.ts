export const getDaysInMonth = (year: number, month: number): Date[] => {
  const days: Date[] = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // Add days from previous month to fill first week
  const firstDayOfWeek = firstDayOfMonth.getDay();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push(date);
  }
  
  // Add days of current month
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const date = new Date(year, month, day);
    days.push(date);
  }
  
  // Add days from next month to fill last week
  const lastDayOfWeek = lastDayOfMonth.getDay();
  for (let i = 1; i < 7 - lastDayOfWeek; i++) {
    const date = new Date(year, month + 1, i);
    days.push(date);
  }
  
  return days;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const parseVoiceInput = (text: string): { 
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  description?: string;
} | null => {
  try {
    // Simple parsing for demonstration
    const dateRegex = /(?:on|for|at) (tomorrow|today|(?:next|this) (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)|(?:january|february|march|april|may|june|july|august|september|october|november|december) \d{1,2}(?:st|nd|rd|th)?(?:,? \d{4})?)/i;
    const timeRegex = /(?:at|from) (\d{1,2}(?::\d{2})? ?(?:am|pm))(?: to (\d{1,2}(?::\d{2})? ?(?:am|pm)))?/i;
    
    const dateMatch = text.match(dateRegex);
    const timeMatch = text.match(timeRegex);
    
    if (!dateMatch) {
      return null;
    }
    
    let title = text;
    
    // Remove date and time from title
    if (dateMatch) {
      title = title.replace(dateMatch[0], '');
    }
    if (timeMatch) {
      title = title.replace(timeMatch[0], '');
    }
    
    // Clean up title
    title = title.replace(/^(?:add|schedule|create|put)(?: an?| a)? (?:event|meeting|appointment|reminder)(?: called| titled| named)? /i, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    
    // Parse date (simplified for demo)
    const now = new Date();
    let eventDate = new Date(now);
    
    const dateText = dateMatch[1].toLowerCase();
    if (dateText === 'tomorrow') {
      eventDate.setDate(now.getDate() + 1);
    } else if (dateText === 'today') {
      // Keep today's date
    } else if (dateText.includes('next')) {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const targetDay = days.indexOf(dateText.split(' ')[1]);
      const currentDay = now.getDay();
      const daysToAdd = (targetDay + 7 - currentDay) % 7;
      eventDate.setDate(now.getDate() + daysToAdd);
    }
    // More complex date parsing would go here
    
    // For demo, we're just returning a basic object
    return {
      title,
      date: eventDate,
      startTime: timeMatch ? timeMatch[1] : undefined,
      endTime: timeMatch && timeMatch[2] ? timeMatch[2] : undefined,
    };
  } catch (error) {
    console.error('Error parsing voice input:', error);
    return null;
  }
};
