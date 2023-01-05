import Color from "color";

import { Theme } from "./bindings/Theme";
import { ColorRGB } from "./types";

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

export const getPathProps = (
  size: number,
  strokeWidth: number,
  rotation: "clockwise" | "counterclockwise"
) => {
  const halfSize = size / 2;
  const halfStrokeWith = strokeWidth / 2;
  const arcRadius = halfSize - halfStrokeWith;
  const arcDiameter = 2 * arcRadius;
  const rotationIndicator = rotation === "clockwise" ? "1,0" : "0,1";

  const pathLength = 2 * Math.PI * arcRadius;
  const path = `m ${halfSize},${halfStrokeWith} a ${arcRadius},${arcRadius} 0 ${rotationIndicator} 0,${arcDiameter} a ${arcRadius},${arcRadius} 0 ${rotationIndicator} 0,-${arcDiameter}`;

  return { path, pathLength };
};

export const getStartAt = (duration: number, initialRemainingTime?: number) => {
  if (duration === 0 || duration === initialRemainingTime) {
    return 0;
  }

  return typeof initialRemainingTime === "number"
    ? duration - initialRemainingTime
    : 0;
};

export const getWrapperStyle = (size: number): React.CSSProperties => ({
  position: "relative",
  width: size,
  height: size,
});

export const timeStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

export const getIsColorBetweenColors = (
  color: ColorRGB,
  start: ColorRGB,
  end: ColorRGB
) => {
  const getIsInRange = (x: number, min: number, max: number) =>
    (x - min) * (x - max) <= 0;

  const getRGB = (color: ColorRGB): number[] =>
    color
      .match(/(\d+),(\d+),(\d+)/)!
      .splice(1, 4)
      .map((c: string) => parseInt(c, 10));

  const colorRGB = getRGB(color);
  const startRGB = getRGB(start);
  const endRGB = getRGB(end);

  return colorRGB.every((c, index) =>
    getIsInRange(c, startRGB[index], endRGB[index])
  );
};

export * as default from "./utils";
