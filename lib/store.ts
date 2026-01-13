import { create } from "zustand";

export type Theme = "light" | "dark" | "system";

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Load theme from localStorage on initialization
const getStoredTheme = (): Theme => {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem("heartlyte-theme");
  return (stored as Theme) || "system";
};

export const useAppStore = create<AppState>((set) => ({
  theme: getStoredTheme(),
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("heartlyte-theme", theme);
    }
    set({ theme });
  },
}));

