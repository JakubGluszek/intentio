import { State } from "@/bindings/State";
import { StateForUpdate } from "@/bindings/StateForUpdate";
import { invoke } from "@tauri-apps/api";

export const getState = async () => {
  return await invoke<State>("get_state");
};

export const updateState = async (data: Partial<StateForUpdate>) => {
  return await invoke<State>("update_state", { data });
};
