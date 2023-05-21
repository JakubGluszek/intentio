import React from "react";
import { appWindow } from "@tauri-apps/api/window";
import { useHotkeys } from "@mantine/hooks";

export type MainWindowDisplay = "Timer" | "Intents";

interface IMainWindowContext {
  display: MainWindowDisplay;
  setDisplay: (value: MainWindowDisplay) => void;
  isFocused: boolean;
}

export const MainWindowContext = React.createContext<IMainWindowContext | null>(
  null
);

interface MainWindowProviderProps {
  children: React.ReactNode;
}

export const MainWindowProvider: React.FC<MainWindowProviderProps> = ({
  children,
}) => {
  const [display, setDisplay] = React.useState<MainWindowDisplay>("Timer");
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    const unlisten = appWindow.onFocusChanged(({ payload }) =>
      setIsFocused(payload)
    );

    return () => unlisten.then((fn) => fn()) as never;
  }, []);

  useHotkeys([
    [
      "Tab",
      () => setDisplay((prev) => (prev === "Timer" ? "Intents" : "Timer")),
    ],
  ]);

  return (
    <MainWindowContext.Provider
      value={{
        isFocused,
        display,
        setDisplay,
      }}
    >
      {children}
    </MainWindowContext.Provider>
  );
};
