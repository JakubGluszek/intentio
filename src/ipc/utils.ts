import { invoke } from "@tauri-apps/api";

import { Theme } from "@/bindings/Theme";

export const getCurrentTheme = async () => {
  return await invoke<Theme>("get_current_theme");
};

export const playAudio = async (path?: string) => {
  return await invoke("play_audio", { audio: path });
};

export const openAudioDir = async () => {
  return await invoke("open_audio_dir");
};

export const hideMainWindow = async () => {
  return await invoke("hide_main_window");
};

export const exitMainWindow = async () => {
  return await invoke("exit_main_window");
};

export const createTinyTimerWindow = async () => {
  return await invoke("create_tiny_timer_window");
};
