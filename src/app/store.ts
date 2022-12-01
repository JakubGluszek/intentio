import create from "zustand";

import { SessionQueue } from "../bindings/SessionQueue";
import { Project } from "../bindings/Project";
import { Queue } from "../bindings/Queue";
import { Session } from "../bindings/Session";
import { Settings } from "../bindings/Settings";
import { Theme } from "../bindings/Theme";

interface State {
  settings?: Settings;
  setSettings: (settings: Settings) => void;

  sessionQueue?: SessionQueue | null;
  setSessionQueue: (queue: SessionQueue | null) => void;
  getTotalQueueCycles: () => number | undefined;

  currentTheme?: Theme;
  setCurrentTheme: (theme: Theme) => void;

  currentProject?: Project;
  setCurrentProject: (p: Project | undefined) => void;
  setCurrentProjectById: (id: string | null) => void;
  getProjectById: (id: string | null) => Project | undefined;

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
  addSession: (session: Session) => void;
  getSessionsByProjectId: (id: string) => Session[];

  queues: Queue[];
  setQueues: (queues: Queue[]) => void;
  addQueue: (queue: Queue) => void;
  updateQueue: (queue: Queue) => void;
  removeQueue: (id: string) => void;
}

const useGlobal = create<State>((set, get) => ({
  settings: undefined,
  setSettings: (settings: Settings) =>
    set((state) => ({ ...state, settings: settings })),

  sessionQueue: undefined,
  setSessionQueue: (aq: SessionQueue | null) =>
    set((state) => ({ ...state, sessionQueue: aq })),
  getTotalQueueCycles: () =>
    get().sessionQueue?.sessions.reduce((p, c) => (p += c.cycles), 0),

  currentTheme: undefined,
  setCurrentTheme: (theme: Theme | undefined) =>
    set((state) => ({ ...state, currentTheme: theme })),

  currentProject: undefined,
  setCurrentProject: (p: Project | undefined) =>
    set((state) => ({ ...state, currentProject: p })),
  setCurrentProjectById: (id: string | null) =>
    set((state) => ({
      ...state,
      currentProject: state.projects.find((p) => p.id === id),
    })),
  getProjectById: (id: string | null) =>
    get().projects.find((p) => p.id === id),

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
  addSession: (session: Session) =>
    set((state) => ({ ...state, sessions: [session, ...state.sessions] })),
  getSessionsByProjectId: (id: string) =>
    get().sessions.filter((s) => s.project_id === id),

  queues: [],
  setQueues: (queues: Queue[]) => set((state) => ({ ...state, queues })),
  addQueue: (queue: Queue) =>
    set((state) => ({ ...state, queues: [queue, ...state.queues] })),
  updateQueue: (queue: Queue) =>
    set((state) => ({
      ...state,
      queues: state.queues.map((q) => (q.id === queue.id ? queue : q)),
    })),
  removeQueue: (id: string) =>
    set((state) => ({
      ...state,
      queues: state.queues.filter((q) => q.id !== id),
    })),
}));

export default useGlobal;
