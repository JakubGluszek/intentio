import { StateCreator } from "zustand";

import { ModelId } from "@/types";
import { Intent } from "@/bindings/Intent";

export interface IntentsSlice {
  intents: Intent[];
  currentIntent: Intent | undefined;
  setIntents: (data: Intent[]) => void;
  addIntent: (data: Intent) => void;
  patchIntent: (id: ModelId, data: Intent) => void;
  removeIntent: (id: ModelId) => void;
  getIntentById: (id?: ModelId | null) => Intent | undefined;
  setCurrentIntent: (data: Intent | undefined) => void;
}

export const createIntentsSlice: StateCreator<
  IntentsSlice,
  [],
  [],
  IntentsSlice
> = (set, get) => ({
  intents: [],

  currentIntent: undefined,

  setIntents: (intents) => set(() => ({ intents })),

  addIntent: (intent) =>
    set((state) => ({ intents: [intent, ...state.intents] })),

  patchIntent: (id, intent) =>
    set((state) => ({
      intents: state.intents.map((i) => (i.id === id ? intent : i)),
    })),

  removeIntent: (id) =>
    set((state) => ({ intents: state.intents.filter((i) => i.id !== id) })),

  getIntentById: (id) => get().intents.find((intent) => intent.id === id),

  setCurrentIntent: (currentIntent) =>
    set((state) => ({ ...state, currentIntent })),
});
