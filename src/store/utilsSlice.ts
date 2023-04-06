import { Theme } from "@/bindings/Theme";
import { StateCreator } from "zustand";
import { ConfigSlice } from "./configSlice";
import { ThemesSlice } from "./themesSlice";

export interface UtilsSlice {
  currentTheme?: Theme;
  setCurrentTheme: (theme: Theme) => void;
  getIdleTheme: () => Theme | undefined;
  getFocusTheme: () => Theme | undefined;
  getBreakTheme: () => Theme | undefined;
  getLongBreakTheme: () => Theme | undefined;
}

export const createUtilsSlice: StateCreator<
  UtilsSlice & ThemesSlice & ConfigSlice,
  [],
  [],
  UtilsSlice
> = (set, get) => ({
  currentTheme: undefined,
  setCurrentTheme: (currentTheme) =>
    set((state) => ({ ...state, currentTheme })),
  getIdleTheme: () =>
    get().themes.find(
      (theme) => theme.id === get().interfaceConfig?.idle_theme_id
    ),
  getFocusTheme: () =>
    get().themes.find(
      (theme) => theme.id === get().interfaceConfig?.focus_theme_id
    ),
  getBreakTheme: () =>
    get().themes.find(
      (theme) => theme.id === get().interfaceConfig?.break_theme_id
    ),
  getLongBreakTheme: () =>
    get().themes.find(
      (theme) => theme.id === get().interfaceConfig?.long_break_theme_id
    ),
});
