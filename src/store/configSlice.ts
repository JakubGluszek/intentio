import { StateCreator } from "zustand";

import { SettingsConfig } from "@/bindings/SettingsConfig";
import { TimerConfig } from "@/bindings/TimerConfig";

export interface ConfigSlice {
  settingsConfig?: SettingsConfig;
  timerConfig?: TimerConfig;

  setSettingsConfig: (data: SettingsConfig) => void;
  setTimerConfig: (data: TimerConfig) => void;
}

export const createConfigSlice: StateCreator<
  ConfigSlice,
  [],
  [],
  ConfigSlice
> = (set) => ({
  settingsConfig: undefined,
  timerConfig: undefined,

  setSettingsConfig: (settingsConfig) =>
    set((state) => ({ ...state, settingsConfig })),
  setTimerConfig: (timerConfig) => set((state) => ({ ...state, timerConfig })),
});
