import { StateCreator } from "zustand";

import { ModelId } from "@/types";
import { Theme } from "@/bindings/Theme";

export interface ThemesSlice {
  themes: Theme[];
  setThemes: (data: Theme[]) => void;
  addTheme: (data: Theme) => void;
  patchTheme: (id: ModelId, data: Theme) => void;
  removeTheme: (id: ModelId) => void;
}

export const createThemesSlice: StateCreator<
  ThemesSlice,
  [],
  [],
  ThemesSlice
> = (set) => ({
  themes: [],
  setThemes: (themes) => set(() => ({ themes })),
  addTheme: (theme) => set((state) => ({ themes: [theme, ...state.themes] })),
  patchTheme: (id, theme) =>
    set((state) => ({
      themes: state.themes.map((i) => (i.id === id ? theme : i)),
    })),
  removeTheme: (id) =>
    set((state) => ({ themes: state.themes.filter((i) => i.id !== id) })),
});
