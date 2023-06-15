import { invoke } from "@tauri-apps/api";

import { ModelId } from "@/types";
import { Script } from "@/bindings/Script";
import { CreateScript } from "@/bindings/CreateScript";
import { UpdateScript } from "@/bindings/UpdateScript";

export const createScript = async (data: CreateScript) => {
  return await invoke<ModelId>("create_script", { data });
};

export const updateScript = async (
  id: ModelId,
  data: Partial<UpdateScript>
) => {
  return await invoke<ModelId>("update_script", { id, data });
};

export const deleteScript = async (id: ModelId) => {
  return await invoke<ModelId>("delete_script", { id });
};

export const getScript = async (id: ModelId) => {
  return await invoke<Script>("get_script", { id });
};

export const getScripts = async () => {
  return await invoke<Script[]>("get_scripts");
};
