
import { DailyRecord, WidgetData, User, AppDatabase, UserProgress } from '../types';

const STORAGE_KEY = 'lifeplanner_v3_db';

const getInitialWidgets = (): WidgetData[] => [
  { id: 'w1', type: 'water', title: 'Water Intake', data: { glasses: 0, goal: 8 } },
  { id: 'w2', type: 'todo', title: 'To-Do List', data: { items: [] } },
  { id: 'w3', type: 'sleep', title: 'Sleep Log', data: { hours: 0, quality: 0 } }
];

const getEmptyProgress = (): UserProgress => ({
  currentDay: {
    date: new Date().toISOString().split('T')[0],
    widgets: getInitialWidgets()
  },
  history: []
});

const getEmptyDB = (): AppDatabase => ({
  users: [],
  userProgress: {}
});

export const dbService = {
  async getDB(): Promise<AppDatabase> {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return getEmptyDB();
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse DB", e);
      return getEmptyDB();
    }
  },

  async saveDB(db: AppDatabase): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  },

  async signup(name: string, email: string, pword: string): Promise<User> {
    const db = await this.getDB();
    if (db.users.find(u => u.email === email)) {
      throw new Error("User already exists");
    }
    const newUser: User = { id: Date.now().toString(), name, email, password: pword, isLoggedIn: true };
    db.users.push(newUser);
    db.userProgress[newUser.id] = getEmptyProgress();
    await this.saveDB(db);
    return newUser;
  },

  async login(email: string, pword: string): Promise<User> {
    const db = await this.getDB();
    const user = db.users.find(u => u.email === email && u.password === pword);
    if (!user) throw new Error("Invalid credentials");
    user.isLoggedIn = true;
    await this.saveDB(db);
    return user;
  },

  async getUserData(userId: string): Promise<UserProgress> {
    const db = await this.getDB();
    let progress = db.userProgress[userId];
    if (!progress) {
      progress = getEmptyProgress();
      db.userProgress[userId] = progress;
      await this.saveDB(db);
    }
    return progress;
  },

  async saveCurrentDayProgress(userId: string, currentDay: DailyRecord): Promise<void> {
    const db = await this.getDB();
    if (!db.userProgress[userId]) {
      db.userProgress[userId] = getEmptyProgress();
    }
    // We only update the currentDay to avoid accidentally overwriting history from a stale DB read
    db.userProgress[userId].currentDay = currentDay;
    await this.saveDB(db);
  },

  async archiveCurrentDay(userId: string): Promise<UserProgress> {
    const db = await this.getDB();
    const progress = db.userProgress[userId];
    if (!progress) throw new Error("No user progress found");

    const today = new Date().toISOString().split('T')[0];
    
    // Deep clone the current day to move to history
    const recordToArchive = JSON.parse(JSON.stringify(progress.currentDay));
    
    // Safety check for history array
    if (!progress.history) progress.history = [];
    
    // Append current snapshot to history
    progress.history.push(recordToArchive);
    
    // Reset for the new day
    progress.currentDay = {
      date: today,
      widgets: progress.currentDay.widgets.map(w => ({
        ...w,
        data: this.getDefaultData(w.type)
      })),
      report: undefined
    };
    
    db.userProgress[userId] = progress;
    await this.saveDB(db);
    return progress;
  },

  getDefaultData(type: string) {
    switch(type) {
      case 'water': return { glasses: 0, goal: 8 };
      case 'todo': return { items: [] };
      case 'sleep': return { hours: 0, quality: 0 };
      case 'diet': return { meals: [] };
      case 'exercise': return { workouts: [] };
      case 'timetable': return { slots: [
        { time: '08:00', task: '' },
        { time: '12:00', task: '' },
        { time: '18:00', task: '' },
        { time: '21:00', task: '' }
      ] };
      default: return {};
    }
  }
};
