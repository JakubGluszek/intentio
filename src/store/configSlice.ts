import { StateCreator } from "zustand";

import { AudioConfig } from "@/bindings/AudioConfig";
import { BehaviorConfig } from "@/bindings/BehaviorConfig";
import { InterfaceConfig } from "@/bindings/InterfaceConfig";
import { TimerConfig } from "@/bindings/TimerConfig";

export interface ConfigSlice {
  timerConfig?: TimerConfig;
  audioConfig?: AudioConfig;
  behaviorConfig?: BehaviorConfig;
  interfaceConfig?: InterfaceConfig;

  setTimerConfig: (data: TimerConfig) => void;
  setAudioConfig: (data: AudioConfig) => void;
  setBehaviorConfig: (data: BehaviorConfig) => void;
  setInterfaceConfig: (data: InterfaceConfig) => void;
}

export const createConfigSlice: StateCreator<
  ConfigSlice,
  [],
  [],
  ConfigSlice
> = (set) => ({
  timerConfig: undefined,
  audioConfig: undefined,
  behaviorConfig: undefined,
  interfaceConfig: undefined,

  setTimerConfig: (timerConfig) => set((state) => ({ ...state, timerConfig })),
  setAudioConfig: (audioConfig) => set((state) => ({ ...state, audioConfig })),
  setBehaviorConfig: (behaviorConfig) =>
    set((state) => ({ ...state, behaviorConfig })),
  setInterfaceConfig: (interfaceConfig) =>
    set((state) => ({ ...state, interfaceConfig })),
});
