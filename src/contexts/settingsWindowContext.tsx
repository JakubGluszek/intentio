import React from "react";

type Panel = "Timer" | "Audio" | "Themes" | "Scripts" | "About";

export type SettingsWindowContextType = {
  panel: Panel;
  setPanel: (value: string) => void;
};

export const SettingsWindowContext =
  React.createContext<SettingsWindowContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const SettingsWindowProvider: React.FC<Props> = ({ children }) => {
  const [panel, setPanel] = React.useState<Panel>("Timer");

  return (
    <SettingsWindowContext.Provider
      value={{ panel, setPanel: (value) => setPanel(value as Panel) }}
    >
      {children}
    </SettingsWindowContext.Provider>
  );
};
