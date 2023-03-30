import React from "react";
import { appWindow, LogicalSize } from "@tauri-apps/api/window";
import config from "@/config";

type DisplayType = "sidebar" | "timer";

export type MainWindowContextType = {
  display: DisplayType;
  isFocused: boolean;
  isCompact: boolean;
  toggleIsCompact: () => void;
  toggleDisplay: () => void;
};

export const MainWindowContext =
  React.createContext<MainWindowContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const MainWindowProvider: React.FC<Props> = ({ children }) => {
  const [display, setDisplay] = React.useState<DisplayType>("timer");
  const [isCompact, setIsCompact] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const toggleDisplay = () => {
    if (display === "timer") {
      let size = new LogicalSize(
        config.windows.main.width,
        config.windows.main.height
      );
      appWindow.setMinSize(size);
      appWindow.setMaxSize(size);
      appWindow.setSize(size);
      setIsCompact(false);
    }
    setDisplay((prev) => (prev === "timer" ? "sidebar" : "timer"));
  };

  const toggleIsCompact = () => {
    if (isCompact) {
      let size = new LogicalSize(
        config.windows.main.width,
        config.windows.main.height
      );
      appWindow.setMinSize(size);
      appWindow.setMaxSize(size);
      appWindow.setSize(size);
    } else {
      // as for now, this doesn't work properly on linux; height is set to 200px for some reason ¯\_(ツ)_/¯
      let size = new LogicalSize(config.windows.main.width, 200);
      appWindow.setMinSize(size);
      appWindow.setMaxSize(size);
      appWindow.setSize(size);
    }
    setIsCompact((prev) => !prev);
  };

  React.useEffect(() => {
    const unlisten = appWindow.onFocusChanged(({ payload }) =>
      setIsFocused(payload)
    );

    return () => unlisten.then((fn) => fn()) as never;
  }, []);

  return (
    <MainWindowContext.Provider
      value={{ display, isCompact, isFocused, toggleIsCompact, toggleDisplay }}
    >
      {children}
    </MainWindowContext.Provider>
  );
};
