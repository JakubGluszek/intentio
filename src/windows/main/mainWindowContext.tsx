import React from "react";

export type MainWindowDisplay = "timer" | "intents";

export interface IMainWindowContext {
  display: MainWindowDisplay;
  setDisplay: (value: MainWindowDisplay) => void;
}

export const MainWindowContext = React.createContext<IMainWindowContext | null>(null);

interface MainWindowProviderProps {
  children: React.ReactNode;
}

export const MainWindowProvider: React.FC<MainWindowProviderProps> = ({
  children,
}) => {
  const [display, setDisplay] = React.useState<MainWindowDisplay>("intents");

  return (
    <MainWindowContext.Provider value={{ display, setDisplay }}>
      {children}
    </MainWindowContext.Provider>
  );
};
