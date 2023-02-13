import { invoke } from "@tauri-apps/api";

import { Script } from "@/bindings/Script";
import { ScriptForCreate } from "@/bindings/ScriptForCreate";
import { ScriptForUpdate } from "@/bindings/ScriptForUpdate";
import { ModelDeleteResultData } from "@/bindings/ModelDeleteResultData";

export const getScripts = async () => {
  return await invoke<Script[]>("get_scripts");
};

export const createScript = async (data: ScriptForCreate) => {
  return await invoke<Script>("create_script", { data });
};

export const updateScript = async (
  id: string,
  data: Partial<ScriptForUpdate>
) => {
  return await invoke<Script>("update_script", { id, data });
};

export const deleteScript = async (id: string) => {
  return await invoke<ModelDeleteResultData>("delete_script", { id });
};
