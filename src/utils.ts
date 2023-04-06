import { Command } from "@tauri-apps/api/shell";
import Color from "color";

import { Theme } from "./bindings/Theme";

export function scale(
  number: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const executeScript = async (content: string) => {
  const output = await new Command("sh", ["-c", content]).execute();

  return output;
};

export const formatTimeTimer = (sec: number): string => {
  const seconds = sec % 60;
  const minutes = ((sec - seconds) / 60).toFixed();
  return `
    ${minutes.length === 1 ? "0" : ""}${minutes}:${seconds < 10 && seconds > 0 ? "0" : ""
    }${seconds}${seconds === 0 ? "0" : ""}
  `;
};

export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
}

export const applyTheme = (theme: Theme) => {
  document.documentElement.style.setProperty(
    "--window-color",
    // @ts-ignore
    Color(theme.window_hex).rgb().color.join(" ")
  );
  document.documentElement.style.setProperty(
    "--base-color",
    // @ts-ignore
    Color(theme.base_hex).rgb().color.join(" ")
  );
  document.documentElement.style.setProperty(
    "--primary-color",
    // @ts-ignore
    Color(theme.primary_hex).rgb().color.join(" ")
  );
  document.documentElement.style.setProperty(
    "--text-color",
    // @ts-ignore
    Color(theme.text_hex).rgb().color.join(" ")
  );
};

export * as default from "./utils";
