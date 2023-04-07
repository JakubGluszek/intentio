import React from "react";

type Panel = "Timer" | "Audio" | "Themes" | "Scripts" | "About";

export type SettingsWindowContextType = {
  panel: Panel;
  setPanel: React.Dispatch<React.SetStateAction<Panel>>;
};

export const SettingsWindowContext =
  React.createContext<SettingsWindowContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const SettingsWindowProvider: React.FC<Props> = ({ children }) => {
  const [panel, setPanel] = React.useState<Panel>("Timer");

  return (
    <SettingsWindowContext.Provider value={{ panel, setPanel }}>
      {children}
    </SettingsWindowContext.Provider>
  );
};
