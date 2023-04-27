import React from "react";
import { appWindow } from "@tauri-apps/api/window";

type DisplayType = "sidebar" | "timer";

export type MainWindowContextType = {
  display: DisplayType;
  isFocused: boolean;
  toggleDisplay: () => void;
};

export const MainWindowContext =
  React.createContext<MainWindowContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const MainWindowProvider: React.FC<Props> = ({ children }) => {
  const [display, setDisplay] = React.useState<DisplayType>("timer");
  const [isFocused, setIsFocused] = React.useState(false);

  const toggleDisplay = () =>
    setDisplay((prev) => (prev === "timer" ? "sidebar" : "timer"));

  React.useEffect(() => {
    const unlisten = appWindow.onFocusChanged(({ payload }) =>
      setIsFocused(payload)
    );

    return () => unlisten.then((fn) => fn()) as never;
  }, []);

  return (
    <MainWindowContext.Provider value={{ display, isFocused, toggleDisplay }}>
      {children}
    </MainWindowContext.Provider>
  );
};
