import { StateCreator } from "zustand";

import { TimerSession } from "@/bindings/TimerSession";

export interface StateSlice {
  timerSession?: TimerSession;

  setTimerSession: (data: TimerSession) => void;
}

export const createStateSlice: StateCreator<StateSlice, [], [], StateSlice> = (
  set
) => ({
  timerSession: undefined,

  setTimerSession: (timerSession) =>
    set((state) => ({ ...state, timerSession })),
});
