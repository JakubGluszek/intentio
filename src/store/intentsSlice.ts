import { StateCreator } from "zustand";

import { Intent } from "@/bindings/Intent";

export interface IntentsSlice {
  intents: Intent[];
  setIntents: (data: Intent[]) => void;
  addIntent: (data: Intent) => void;
  patchIntent: (id: string, data: Intent) => void;
  removeIntent: (id: string) => void;
  getIntentById: (id?: string | null) => Intent | undefined;
  getAllTags: () => string[];
}

export const createIntentsSlice: StateCreator<
  IntentsSlice,
  [],
  [],
  IntentsSlice
> = (set, get) => ({
  intents: [],

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

  getAllTags: () => {
    let allTags: string[] = [];

    get().intents.forEach((intent) => {
      allTags = allTags.concat(intent.tags);
    });

    return allTags;
  },
});
