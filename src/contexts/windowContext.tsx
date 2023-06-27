import React from "react";

import { useScaleWindow, WindowScale } from "@/hooks";

export interface IWindowContext {
  windowScale: WindowScale;
}

export const WindowContext = React.createContext<IWindowContext | null>(null);

interface WindowProviderProps {
  children: React.ReactNode;
}

export const WindowProvider: React.FC<WindowProviderProps> = ({
  children,
}) => {
  const windowScale = useScaleWindow();

  return (
    <WindowContext.Provider value={{ windowScale }}>
      {children}
    </WindowContext.Provider>
  );
};
