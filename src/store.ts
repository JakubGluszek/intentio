import create from "zustand";

import { Project } from "./bindings/Project";
import { Theme } from "./bindings/Theme";

interface State {
  currentTheme?: Theme;
  setCurrentTheme: (theme: Theme) => void;

  currentProject?: Project;
  setCurrentProject: (p: Project) => void;

  projects: Project[];
  setProjects: (projects: Project[]) => void;

  themes: Theme[];
  setThemes: (themes: Theme[]) => void;
  addTheme: (theme: Theme) => void;
  removeTheme: (id: string) => void;
  updateTheme: (theme: Theme) => void;
}

const useGlobal = create<State>((set) => ({
  currentTheme: undefined,
  setCurrentTheme: (theme: Theme) =>
    set((state) => ({ ...state, currentTheme: theme })),

  currentProject: undefined,
  setCurrentProject: (p: Project) =>
    set((state) => ({ ...state, currentProject: p })),

  projects: [],
  setProjects: (projects: Project[]) =>
    set((state) => ({ ...state, projects })),

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
}));

export default useGlobal;
