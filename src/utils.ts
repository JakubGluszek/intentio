import { invoke } from "@tauri-apps/api/tauri";
import { Theme } from "./bindings/Theme";

export const formatTime = (sec: number): String => {
  let seconds = sec % 60;
  let minutes = ((sec - seconds) / 60).toFixed();
  return `
    ${minutes.length === 1 ? "0" : ""}${minutes}:${
    seconds < 10 && seconds > 0 ? "0" : ""
  }${seconds}${seconds === 0 ? "0" : ""}
  `;
};

export const applyTheme = (theme: Theme) => {
  document.documentElement.style.setProperty(
    "--window-color",
    theme.window_hex
  );
  document.documentElement.style.setProperty("--base-color", theme.base_hex);
  document.documentElement.style.setProperty(
    "--primary-color",
    theme.primary_hex
  );
  document.documentElement.style.setProperty("--text-color", theme.text_hex);
};

export const playAudio = async (path?: string) => {
  await invoke("play_audio", { path });
};
