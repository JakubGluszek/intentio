import { StateCreator } from "zustand";

import { Task } from "@/bindings/Task";

export interface TasksSlice {
  tasks: Task[];
  setTasks: (data: Task[]) => void;
  addTask: (data: Task) => void;
  patchTask: (id: string, data: Task) => void;
  removeTask: (id: string) => void;
  getTaskByIntent: (intentId: string) => Task[];
}

export const createTasksSlice: StateCreator<TasksSlice, [], [], TasksSlice> = (
  set,
  get
) => ({
  tasks: [],
  setTasks: (tasks) => set(() => ({ tasks })),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  patchTask: (id, task) =>
    set((state) => ({
      tasks: state.tasks.map((i) => (i.id === id ? task : i)),
    })),
  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((i) => i.id !== id) })),
  getTaskByIntent: (intentId: string) =>
    get().tasks.filter((task) => task.intent_id === intentId),
});
