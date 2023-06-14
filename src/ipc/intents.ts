import { invoke } from "@tauri-apps/api";

import { ModelId } from "@/types";
import { Intent } from "@/bindings/Intent";
import { CreateIntent } from "@/bindings/CreateIntent";
import { UpdateIntent } from "@/bindings/UpdateIntent";

export const createIntent = async (data: CreateIntent) => {
  return await invoke<ModelId>("create_intent", { data });
};

export const updateIntent = async (
  id: ModelId,
  data: Partial<UpdateIntent>
) => {
  return await invoke<ModelId>("update_intent", { id, data });
};

export const deleteIntent = async (id: ModelId) => {
  return await invoke<ModelId>("delete_intent", { id });
};

export const getIntent = async (id: ModelId) => {
  return await invoke<Intent>("get_intent", { id });
};

export const getIntents = async () => {
  return await invoke<Intent[]>("get_intents");
};

export const archiveIntent = async (id: ModelId) => {
  return await invoke<ModelId>("archive_intent", { id });
};

export const unarchiveIntent = async (id: ModelId) => {
  return await invoke<ModelId>("unarchive_intent", { id });
};
