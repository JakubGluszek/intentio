import { StateCreator } from "zustand";

import { State } from "@/bindings/State";

export interface StateSlice {
  state?: State;
  setState: (data: State) => void;
}

export const createStateSlice: StateCreator<StateSlice, [], [], StateSlice> = (
  set
) => ({
  state: undefined,
  setState: (state) => set(() => ({ state })),
});
