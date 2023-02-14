import { StateCreator } from "zustand";

import { Note } from "@/bindings/Note";

export interface NotesSlice {
  notes: Note[];
  setNotes: (data: Note[]) => void;
  addNote: (data: Note) => void;
  patchNote: (id: string, data: Note) => void;
  removeNote: (id: string) => void;
  getNotesByIntent: (intentId: string) => Note[];
  getNotesByDate: (date: string, intentId?: string) => Note[]; // date example: 2023-02-14
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

  getNotesByDate: (date, intentId) => {
    var notes = get().notes;

    if (intentId) {
      notes = notes.filter((note) => note.intent_id === intentId);
    }

    notes = notes.filter(
      (note) =>
        date === new Date(parseInt(note.created_at)).toISOString().split("T")[0]
    );

    return notes;
  },
});
