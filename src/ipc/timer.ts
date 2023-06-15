import { invoke } from "@tauri-apps/api";

export const timerPlay = async () => {
  return await invoke<void>("timer_play", {});
};

export const timerStop = async () => {
  return await invoke<void>("timer_stop", {});
};

export const timerRestart = async () => {
  return await invoke<void>("timer_restart", {});
};

export const timerSkip = async () => {
  return await invoke<void>("timer_skip", {});
};

export const timerSetIntent = async (id: number) => {
  return await invoke<void>("timer_set_intent", { id });
};
