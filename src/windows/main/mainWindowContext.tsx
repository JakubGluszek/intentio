import React from "react";

export type MainWindowDisplay = "timer" | "intents";

export interface IMainWindowContext {
  display: MainWindowDisplay;
  setDisplay: (value: MainWindowDisplay) => void;
  displayNavbar: boolean;
  setDisplayNavbar: (display: boolean) => void;
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
  const [display, setDisplay] = React.useState<MainWindowDisplay>("intents");
  const [displayNavbar, setDisplayNavbar] = React.useState(true);

  return (
    <MainWindowContext.Provider
      value={{ display, setDisplay, displayNavbar, setDisplayNavbar }}
    >
      {children}
    </MainWindowContext.Provider>
  );
};
