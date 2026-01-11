import { create } from "zustand";
import { format, subDays } from "date-fns";
import { mockData } from "./mock-data";

interface MoodEntry {
  date: string;
  value: number;
  note?: string;
  emotions?: string[];
}

interface MoodStore {
  moods: MoodEntry[];
  initializeMoods: () => void;
  updateMood: (date: string, mood: number, note?: string, emotions?: string[]) => void;
  getMood: (date: string) => MoodEntry | undefined;
  getTodayMood: () => MoodEntry | undefined;
}

export const useMoodStore = create<MoodStore>((set, get) => ({
  moods: [],
  
  initializeMoods: () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const todayMood = get().getMood(today);
    
    if (get().moods.length === 0) {
      // Initialize with mock data, ensuring today exists
      const initialMoods = mockData.mood.map((m) => ({
        date: m.date,
        value: m.value,
        note: m.note || undefined,
        emotions: [],
      }));
      
      // Add today if not present
      if (!todayMood) {
        initialMoods.push({
          date: today,
          value: 65,
          note: undefined,
          emotions: [],
        });
      }
      
      set({ moods: initialMoods });
    }
  },
  
  updateMood: (date, value, note, emotions) => {
    set((state) => {
      const existing = state.moods.find((m) => m.date === date);
      const updated: MoodEntry = {
        date,
        value,
        note,
        emotions,
      };
      
      if (existing) {
        return {
          moods: state.moods.map((m) => (m.date === date ? updated : m)),
        };
      } else {
        return {
          moods: [...state.moods, updated],
        };
      }
    });
  },
  
  getMood: (date) => {
    return get().moods.find((m) => m.date === date);
  },
  
  getTodayMood: () => {
    const today = format(new Date(), "yyyy-MM-dd");
    return get().getMood(today);
  },
}));

