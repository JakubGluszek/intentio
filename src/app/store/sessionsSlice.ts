import { StateCreator } from "zustand";

import { Session } from "@/bindings/Session";

export interface SessionsSlice {
  sessions: Session[];
  setSessions: (data: Session[]) => void;
  addSession: (data: Session) => void;
}

export const createSessionsSlice: StateCreator<
  SessionsSlice,
  [],
  [],
  SessionsSlice
> = (set) => ({
  sessions: [],
  setSessions: (sessions) => set(() => ({ sessions })),
  addSession: (session) =>
    set((state) => ({ sessions: [session, ...state.sessions] })),
});
