import create from "zustand";

import { createIntentsSlice, IntentsSlice } from "./intentsSlice";
import { createNotesSlice, NotesSlice } from "./notesSlice";
import { createSessionsSlice, SessionsSlice } from "./sessionsSlice";
import { createSettingsSlice, SettingsSlice } from "./settingsSlice";
import { createStateSlice, StateSlice } from "./stateSlice";
import { createTasksSlice, TasksSlice } from "./tasksSlice";
import { createThemesSlice, ThemesSlice } from "./themesSlice";
import { createUtilsSlice, UtilsSlice } from "./utilsSlice";

type Store = SettingsSlice &
  StateSlice &
  IntentsSlice &
  SessionsSlice &
  ThemesSlice &
  TasksSlice &
  NotesSlice &
  UtilsSlice;

const useStore = create<Store>()((...a) => ({
  ...createSettingsSlice(...a),
  ...createStateSlice(...a),
  ...createIntentsSlice(...a),
  ...createSessionsSlice(...a),
  ...createThemesSlice(...a),
  ...createTasksSlice(...a),
  ...createNotesSlice(...a),
  ...createUtilsSlice(...a),
}));

export default useStore;
