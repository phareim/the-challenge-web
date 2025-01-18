export interface User {
  id: string;
  displayName: string;
  initials: string;
  joinedDate: string;
  stats: {
    allTimeScore: number;
    perfectDays: number;
  };
  settings: {
    notifications: {
      dailyReminders: boolean;
      weeklySummary: boolean;
    };
    email?: string;
  };
} 