import { invoke } from "@tauri-apps/api";

export const getActiveIntentId = async () => {
  return await invoke<string | undefined>("get_active_intent_id");
};

export const setActiveIntentId = async (data: string | undefined) => {
  return await invoke<string | undefined>("set_active_intent_id", { data });
};
