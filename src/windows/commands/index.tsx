import { appWindow } from "@tauri-apps/api/window";
import React from "react";

const CommandsWindow: React.FC = () => {
  React.useEffect(() => {
    const onKeyDownHandler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;

      appWindow.hide();
    };

    document.addEventListener("keydown", onKeyDownHandler);

    return () => {
      document.removeEventListener("keydown", onKeyDownHandler);
      appWindow.onFocusChanged(
        ({ payload: isFocused }) => isFocused === false && appWindow.hide()
      );
    };
  }, []);
  return <div>YOIIINK</div>;
};

export default CommandsWindow;
