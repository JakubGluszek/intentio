import { StateCreator } from "zustand";

import { Settings } from "@/bindings/Settings";

export interface SettingsSlice {
  settings?: Settings;
  setSettings: (data: Settings) => void;
}

export const createSettingsSlice: StateCreator<
  SettingsSlice,
  [],
  [],
  SettingsSlice
> = (set) => ({
  settings: undefined,
  setSettings: (settings) => set(() => ({ settings })),
});
