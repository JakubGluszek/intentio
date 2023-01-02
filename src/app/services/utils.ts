import { Theme } from "@/bindings/Theme";
import { invoke } from "@tauri-apps/api";

export const getCurrentTheme = async () => {
  return await invoke<Theme>("get_current_theme");
};

export const setCurrentTheme = async (themeId: string) => {
  return await invoke<Theme>("set_current_theme", {
    data: { current_theme_id: themeId },
  });
};

// remove this if howler.js is implemented instead of calling tauri command
export const playAudio = async (path?: string) => {
  return await invoke("play_audio", { data: path });
};

export const openAudioDir = async () => {
  return await invoke("open_audio_dir");
};
