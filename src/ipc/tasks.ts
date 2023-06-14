import { invoke } from "@tauri-apps/api";

import { ModelId } from "@/types";
import { Task } from "@/bindings/Task";
import { UpdateTask } from "@/bindings/UpdateTask";
import { CreateTask } from "@/bindings/CreateTask";

export const createTask = async (data: CreateTask) => {
  return await invoke<ModelId>("create_task", { data });
};

export const updateTask = async (id: ModelId, data: Partial<UpdateTask>) => {
  return await invoke<ModelId>("update_task", { id, data });
};

export const deleteTask = async (id: ModelId) => {
  return await invoke<ModelId>("delete_task", { id });
};

export const getTask = async (id: ModelId) => {
  return await invoke<Task>("get_task", { id });
};

export const getTasks = async () => {
  return await invoke<Task[]>("get_tasks");
};

export const completeTask = async (id: ModelId) => {
  return await invoke<ModelId>("complete_task", { id });
};

export const uncompleteTask = async (id: ModelId) => {
  return await invoke<ModelId>("uncomplete_task", { id });
};
