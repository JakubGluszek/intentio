import { StateCreator } from "zustand";

import { Script } from "@/bindings/Script";

export interface ScriptsSlice {
  scripts: Script[];
  setScripts: (data: Script[]) => void;
  addScript: (data: Script) => void;
  patchScript: (id: string, data: Script) => void;
  removeScript: (id: string) => void;
}

export const createScriptsSlice: StateCreator<
  ScriptsSlice,
  [],
  [],
  ScriptsSlice
> = (set) => ({
  scripts: [],
  setScripts: (scripts) => set(() => ({ scripts })),
  addScript: (script) =>
    set((state) => ({ scripts: [script, ...state.scripts] })),
  patchScript: (id, script) =>
    set((state) => ({
      scripts: state.scripts.map((i) => (i.id === id ? script : i)),
    })),
  removeScript: (id) =>
    set((state) => ({ scripts: state.scripts.filter((i) => i.id !== id) })),
});
