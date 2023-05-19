import React from "react";
import { appWindow } from "@tauri-apps/api/window";

export type MainWindowContextType = {
  isFocused: boolean;
};

export const MainWindowContext =
  React.createContext<MainWindowContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const MainWindowProvider: React.FC<Props> = ({ children }) => {
  const [isFocused, setIsFocused] = React.useState(false);

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
      }}
    >
      {children}
    </MainWindowContext.Provider>
  );
};
