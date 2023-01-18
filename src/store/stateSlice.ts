import { StateCreator } from "zustand";

import { Intent } from "@/bindings/Intent";
import { IntentsSlice } from "./intentsSlice";

export interface StateSlice {
  activeIntentId?: string;
  setActiveIntentId: (id: string | undefined) => void;
  getActiveIntent: () => Intent | undefined;
}

export const createStateSlice: StateCreator<
  StateSlice & IntentsSlice,
  [],
  [],
  StateSlice
> = (set, get) => ({
  activeIntentId: undefined,
  setActiveIntentId: (activeIntentId) => set(() => ({ activeIntentId })),
  getActiveIntent: () =>
    get().intents.find((intent) => intent.id === get().activeIntentId),
});
