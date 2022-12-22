import { Theme } from "@/bindings/Theme";
import { StateCreator } from "zustand";
import { SettingsSlice } from "./settingsSlice";
import { ThemesSlice } from "./themesSlice";

export interface UtilsSlice {
  currentTheme?: Theme;
  setCurrentTheme: (theme: Theme) => void;
}

export const createUtilsSlice: StateCreator<
  UtilsSlice & SettingsSlice & ThemesSlice,
  [],
  [],
  UtilsSlice
> = (set) => ({
  currentTheme: undefined,
  setCurrentTheme: (currentTheme) => set(() => ({ currentTheme })),
});
