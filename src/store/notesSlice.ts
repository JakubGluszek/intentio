import { StateCreator } from "zustand";

import { Note } from "@/bindings/Note";

export interface NotesSlice {
  notes: Note[];
  setNotes: (data: Note[]) => void;
  addNote: (data: Note) => void;
  patchNote: (id: string, data: Note) => void;
  removeNote: (id: string) => void;
  getNotesByIntent: (intentId: string) => Note[];
}

export const createNotesSlice: StateCreator<NotesSlice, [], [], NotesSlice> = (
  set,
  get
) => ({
  notes: [],
  setNotes: (notes) => set(() => ({ notes })),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  patchNote: (id, note) =>
    set((state) => ({
      notes: state.notes.map((i) => (i.id === id ? note : i)),
    })),
  removeNote: (id) =>
    set((state) => ({ notes: state.notes.filter((i) => i.id !== id) })),
  getNotesByIntent: (intentId: string) =>
    get().notes.filter((note) => note.intent_id === intentId),
});
