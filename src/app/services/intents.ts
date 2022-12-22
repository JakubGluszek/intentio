import { invoke } from "@tauri-apps/api";

import { Intent } from "@/bindings/Intent";
import { IntentForCreate } from "@/bindings/IntentForCreate";
import { IntentForUpdate } from "@/bindings/IntentForUpdate";
import { ModelDeleteResultData } from "@/bindings/ModelDeleteResultData";

export const getIntents = async () => {
  return await invoke<Intent[]>("get_intents");
};

export const createIntent = async (data: IntentForCreate) => {
  return await invoke<Intent>("create_intent", { data });
};

export const updateIntent = async (id: string, data: IntentForUpdate) => {
  return await invoke<Intent>("update_intent", { id, data });
};

export const deleteIntent = async (id: string) => {
  return await invoke<ModelDeleteResultData>("delete_intent", { id });
};
