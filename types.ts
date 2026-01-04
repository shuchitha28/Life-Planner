
export type WidgetType = 'water' | 'exercise' | 'diet' | 'todo' | 'sleep' | 'timetable';

export interface WidgetData {
  id: string;
  type: WidgetType;
  title: string;
  data: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // For mock auth
  isLoggedIn: boolean;
}

export interface DailyRecord {
  date: string; // ISO Date YYYY-MM-DD
  widgets: WidgetData[];
  report?: DailyReport;
}

export interface DailyReport {
  summary: string;
  score: number;
  tips: string[];
}

export interface UserProgress {
  currentDay: DailyRecord;
  history: DailyRecord[];
}

export interface AppDatabase {
  users: User[];
  userProgress: Record<string, UserProgress>; // Key is user ID
}
