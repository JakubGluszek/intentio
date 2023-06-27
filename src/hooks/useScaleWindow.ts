import React from "react";
import { appWindow, LogicalSize } from "@tauri-apps/api/window";
import { useHotkeys } from "@mantine/hooks";

export interface WindowScale {
  fontSize: number;
  iconSize: number;
}

export const useScaleWindow = (): WindowScale => {
  const [fontSize, setFontSize] = React.useState(16);

  const updateSize = () => {
    let root = document.querySelector(":root");
    // @ts-ignore
    root.style.fontSize = `${fontSize}px`;
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    const size = new LogicalSize(width, height);
    appWindow.setMinSize(size);
    appWindow.setMaxSize(size);
    appWindow.setSize(size);
  };

  React.useEffect(() => {
    updateSize();
  }, []);

  React.useEffect(() => {
    updateSize();
  }, [fontSize]);

  useHotkeys([
    ["ctrl+=", () => setFontSize((prev) => prev + 1)],
    ["ctrl+-", () => setFontSize((prev) => prev - 1)],
    ["ctrl+0", () => setFontSize(16)],
  ]);

  return {
    fontSize,
    iconSize: fontSize + fontSize * 0.25,
  } as const;
};
