import create from "zustand";

import { createIntentsSlice, IntentsSlice } from "./intentsSlice";
import { createNotesSlice, NotesSlice } from "./notesSlice";
import { createSessionsSlice, SessionsSlice } from "./sessionsSlice";
import { createStateSlice, StateSlice } from "./stateSlice";
import { createTasksSlice, TasksSlice } from "./tasksSlice";
import { createThemesSlice, ThemesSlice } from "./themesSlice";
import { createUtilsSlice, UtilsSlice } from "./utilsSlice";
import { createScriptsSlice, ScriptsSlice } from "./scriptsSlice";
import { ConfigSlice, createConfigSlice } from "./configSlice";

type Store = StateSlice &
  IntentsSlice &
  SessionsSlice &
  ThemesSlice &
  TasksSlice &
  NotesSlice &
  UtilsSlice &
  ScriptsSlice &
  ConfigSlice;

const useStore = create<Store>()((...a) => ({
  ...createStateSlice(...a),
  ...createIntentsSlice(...a),
  ...createSessionsSlice(...a),
  ...createThemesSlice(...a),
  ...createTasksSlice(...a),
  ...createNotesSlice(...a),
  ...createUtilsSlice(...a),
  ...createScriptsSlice(...a),
  ...createConfigSlice(...a),
}));

export default useStore;
