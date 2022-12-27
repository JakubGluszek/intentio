import { invoke } from "@tauri-apps/api";

export const get_active_intent_id = async () => {
  return await invoke<string | undefined>("get_active_intent_id");
};

export const set_active_intent_id = async (data: string | undefined) => {
  return await invoke<string | undefined>("set_active_intent_id", { data });
};
