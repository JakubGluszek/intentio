import { StateCreator } from "zustand";

import { ModelId } from "@/types";
import { Task } from "@/bindings/Task";

export interface TasksSlice {
  tasks: Task[];
  setTasks: (data: Task[]) => void;
  addTask: (data: Task) => void;
  patchTask: (id: ModelId, data: Task) => void;
  removeTask: (id: ModelId) => void;
  getTaskByIntent: (intentId: ModelId) => Task[];
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

  getTaskByIntent: (intentId) =>
    get().tasks.filter((task) => task.intent_id === intentId),
});
