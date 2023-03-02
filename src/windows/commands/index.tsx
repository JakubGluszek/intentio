import React from "react";
import { appWindow } from "@tauri-apps/api/window";

import WindowContainer from "@/components/WindowContainer";

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
  return <WindowContainer>yoink</WindowContainer>;
};

export default CommandsWindow;
