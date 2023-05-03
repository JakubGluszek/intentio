import { create } from "zustand";

import { createIntentsSlice, IntentsSlice } from "./intentsSlice";
import { createNotesSlice, NotesSlice } from "./notesSlice";
import { createSessionsSlice, SessionsSlice } from "./sessionsSlice";
import { createTasksSlice, TasksSlice } from "./tasksSlice";
import { createThemesSlice, ThemesSlice } from "./themesSlice";
import { createStateSlice, StateSlice } from "./stateSlice";
import { createScriptsSlice, ScriptsSlice } from "./scriptsSlice";
import { ConfigSlice, createConfigSlice } from "./configSlice";

type Store = IntentsSlice &
  SessionsSlice &
  ThemesSlice &
  TasksSlice &
  NotesSlice &
  StateSlice &
  ScriptsSlice &
  ConfigSlice;

const useStore = create<Store>()((...a) => ({
  ...createIntentsSlice(...a),
  ...createSessionsSlice(...a),
  ...createThemesSlice(...a),
  ...createTasksSlice(...a),
  ...createNotesSlice(...a),
  ...createStateSlice(...a),
  ...createScriptsSlice(...a),
  ...createConfigSlice(...a),
}));

export default useStore;
