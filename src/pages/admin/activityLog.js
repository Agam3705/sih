import { useState, useCallback } from 'react';

// Initial mock activities
const initialActivities = [
  {
    id: 1,
    type: 'Event Added',
    description: 'Created a new event: "Annual Tech Hackathon 2025"',
    timestamp: new Date('2025-09-25T14:30:00'),
  },
  {
    id: 2,
    type: 'Mentor Approved',
    description: 'Approved mentor application for Rohan Mehra',
    timestamp: new Date('2025-09-25T11:00:00'),
  },
  {
    id: 3,
    type: 'Reply Sent',
    description: 'Replied to a request from Jane Smith regarding "Open Work Request"',
    timestamp: new Date('2025-09-24T18:45:00'),
  },
];

// Custom hook to manage the activity log state
let activityLog = [...initialActivities];
const listeners = new Set();

const useActivityLog = () => {
  const [log, setLog] = useState(activityLog);

  const addActivity = useCallback((type, description) => {
    const newActivity = {
      id: Date.now(),
      type,
      description,
      timestamp: new Date(),
    };
    activityLog = [newActivity, ...activityLog];
    listeners.forEach(listener => listener(activityLog));
  }, []);
  
  useState(() => {
      const listener = (newLog) => setLog(newLog);
      listeners.add(listener);
      return () => listeners.delete(listener);
  }, []);

  return { log, addActivity };
};

export default useActivityLog;