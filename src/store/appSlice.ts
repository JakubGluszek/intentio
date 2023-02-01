import { StateCreator } from "zustand";

export interface AppSlice {
  tauriDragEnabled: boolean;

  setTauriDragEnabled: (b: boolean) => void;
}

export const createAppSlice: StateCreator<AppSlice, [], [], AppSlice> = (
  set
) => ({
  tauriDragEnabled: true,

  setTauriDragEnabled: (tauriDragEnabled) =>
    set((state) => ({ ...state, tauriDragEnabled })),
});
