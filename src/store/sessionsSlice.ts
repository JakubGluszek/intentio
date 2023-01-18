import { StateCreator } from "zustand";

import { Session } from "@/bindings/Session";

export interface SessionsSlice {
  sessions: Session[];
  setSessions: (data: Session[]) => void;
  addSession: (data: Session) => void;
  getSessionsByIntentId: (id: string) => Session[];
}

export const createSessionsSlice: StateCreator<
  SessionsSlice,
  [],
  [],
  SessionsSlice
> = (set, get) => ({
  sessions: [],
  setSessions: (sessions) => set(() => ({ sessions })),
  addSession: (session) =>
    set((state) => ({ sessions: [session, ...state.sessions] })),
  getSessionsByIntentId: (intentId: string) =>
    get().sessions.filter((session) => session.intent_id === intentId),
});
