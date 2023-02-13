import { invoke } from "@tauri-apps/api";

import { Task } from "@/bindings/Task";
import { TaskForCreate } from "@/bindings/TaskForCreate";
import { TaskForUpdate } from "@/bindings/TaskForUpdate";
import { ModelDeleteResultData } from "@/bindings/ModelDeleteResultData";

export const getTasks = async () => {
  return await invoke<Task[]>("get_tasks");
};

export const createTask = async (data: TaskForCreate) => {
  return await invoke<Task>("create_task", { data });
};

export const updateTask = async (id: string, data: Partial<TaskForUpdate>) => {
  return await invoke<Task>("update_task", { id, data });
};

export const deleteTask = async (id: string) => {
  return await invoke<ModelDeleteResultData>("delete_task", { id });
};

export const deleteTasks = async (ids: string[]) => {
  return await invoke<ModelDeleteResultData>("delete_tasks", { ids });
};
