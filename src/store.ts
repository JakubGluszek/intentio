import create from "zustand";

import { Project } from "./bindings/Project";
import { Session } from "./bindings/Session";
import { Settings } from "./bindings/Settings";
import { Theme } from "./bindings/Theme";

interface State {
  settings?: Settings;
  setSettings: (settings: Settings) => void;

  currentTheme?: Theme;
  setCurrentTheme: (theme: Theme) => void;

  currentProject?: Project;
  setCurrentProject: (p: Project | undefined) => void;

  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;

  themes: Theme[];
  setThemes: (themes: Theme[]) => void;
  addTheme: (theme: Theme) => void;
  removeTheme: (id: string) => void;
  updateTheme: (theme: Theme) => void;

  sessions: Session[];
  setSessions: (sessions: Session[]) => void;
}

const useGlobal = create<State>((set) => ({
  settings: undefined,
  setSettings: (settings: Settings) =>
    set((state) => ({ ...state, settings: settings })),

  currentTheme: undefined,
  setCurrentTheme: (theme: Theme) =>
    set((state) => ({ ...state, currentTheme: theme })),

  currentProject: undefined,
  setCurrentProject: (p: Project | undefined) =>
    set((state) => ({ ...state, currentProject: p })),

  projects: [],
  setProjects: (projects: Project[]) =>
    set((state) => ({ ...state, projects })),
  addProject: (project: Project) =>
    set((state) => ({ ...state, projects: [project, ...state.projects] })),
  removeProject: (id: string) =>
    set((state) => ({
      ...state,
      projects: state.projects.filter((p) => p.id !== id),
    })),

  themes: [],
  setThemes: (themes: Theme[]) => set((state) => ({ ...state, themes })),
  addTheme: (theme: Theme) =>
    set((state) => ({ ...state, themes: [theme, ...state.themes] })),
  removeTheme: (id: string) =>
    set((state) => ({
      ...state,
      themes: state.themes.filter((t) => t.id !== id),
    })),
  updateTheme: (theme: Theme) =>
    set((state) => ({
      ...state,
      themes: state.themes.map((t) => (t.id === theme.id ? theme : t)),
    })),

  sessions: [],
  setSessions: (sessions: Session[]) =>
    set((state) => ({ ...state, sessions })),
}));

export default useGlobal;
