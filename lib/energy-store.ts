import { create } from "zustand";
import { format } from "date-fns";
import { mockData } from "./mock-data";

interface EnergyEntry {
  date: string;
  value: number;
  note?: string;
  peakTime?: string;
}

interface EnergyStore {
  energies: EnergyEntry[];
  initializeEnergies: () => void;
  updateEnergy: (date: string, value: number, note?: string, peakTime?: string) => void;
  getEnergy: (date: string) => EnergyEntry | undefined;
  getTodayEnergy: () => EnergyEntry | undefined;
}

export const useEnergyStore = create<EnergyStore>((set, get) => ({
  energies: [],
  
  initializeEnergies: () => {
    if (get().energies.length === 0) {
      const today = format(new Date(), "yyyy-MM-dd");
      const initialEnergies: EnergyEntry[] = mockData.energy.map((e) => ({
        date: e.date,
        value: e.value,
        note: undefined,
        peakTime: undefined,
      }));
      
      // Add today if not present
      const todayEnergy = initialEnergies.find((e) => e.date === today);
      if (!todayEnergy) {
        initialEnergies.push({
          date: today,
          value: 60,
          note: undefined,
          peakTime: "09:00",
        });
      }
      
      set({ energies: initialEnergies });
    }
  },
  
  updateEnergy: (date, value, note, peakTime) => {
    set((state) => {
      const existing = state.energies.find((e) => e.date === date);
      const updated: EnergyEntry = {
        date,
        value,
        note,
        peakTime,
      };
      
      if (existing) {
        return {
          energies: state.energies.map((e) => (e.date === date ? updated : e)),
        };
      } else {
        return {
          energies: [...state.energies, updated],
        };
      }
    });
  },
  
  getEnergy: (date) => {
    return get().energies.find((e) => e.date === date);
  },
  
  getTodayEnergy: () => {
    const today = format(new Date(), "yyyy-MM-dd");
    return get().getEnergy(today);
  },
}));

