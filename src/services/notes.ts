import { invoke } from "@tauri-apps/api";

import { Note } from "@/bindings/Note";
import { NoteForCreate } from "@/bindings/NoteForCreate";
import { NoteForUpdate } from "@/bindings/NoteForUpdate";
import { ModelDeleteResultData } from "@/bindings/ModelDeleteResultData";

export const getNotes = async () => {
  return await invoke<Note[]>("get_notes");
};

export const createNote = async (data: NoteForCreate) => {
  return await invoke<Note>("create_note", { data });
};

export const updateNote = async (id: string, data: Partial<NoteForUpdate>) => {
  return await invoke<Note>("update_note", { id, data });
};

export const deleteNote = async (id: string) => {
  return await invoke<ModelDeleteResultData>("delete_note", { id });
};
