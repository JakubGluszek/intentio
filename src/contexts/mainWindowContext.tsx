import React from "react";
import { appWindow } from "@tauri-apps/api/window";

export type MainWindowDisplay = "Timer" | "Intent" | "Intents" | "Summary";

export interface IMainWindowContext {
  display: MainWindowDisplay;
  setDisplay: (value: MainWindowDisplay) => void;
  prevDisplay: MainWindowDisplay;
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
  const [prevDisplay, setPrevDisplay] =
    React.useState<MainWindowDisplay>("Timer");
  const [isFocused, setIsFocused] = React.useState(false);

  const handleSetDisplay = (value: MainWindowDisplay) => {
    setPrevDisplay(display);
    setDisplay(value);
  };

  React.useEffect(() => {
    const unlisten = appWindow.onFocusChanged(({ payload }) =>
      setIsFocused(payload)
    );

    return () => unlisten.then((fn) => fn()) as never;
  }, []);

  return (
    <MainWindowContext.Provider
      value={{
        isFocused,
        display,
        prevDisplay,
        setDisplay: handleSetDisplay,
      }}
    >
      {children}
    </MainWindowContext.Provider>
  );
};
