import { Theme } from "@/bindings/Theme";
import { invoke } from "@tauri-apps/api";

export const getCurrentTheme = async () => {
  return await invoke<Theme>("get_current_theme");
};

export const setCurrentTheme = async (id: string) => {
  return await invoke<Theme>("set_current_theme", { id });
};

// remove this if howler.js is implemented instead of calling tauri command
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
