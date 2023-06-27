import React from "react";
import { Toaster } from "react-hot-toast";

import { useDragWindow, useEvents, usePreventContextMenu } from "@/hooks";
import ipc from "@/ipc";
import useStore from "@/store";
import utils from "@/utils";
import { WindowProvider } from "@/contexts";

export interface WindowContainerProps {
  children: React.ReactNode;
}

export const WindowContainer: React.FC<WindowContainerProps> = (props) => {
  const store = useStore();

  useDragWindow();
  usePreventContextMenu();

  useEvents({
    preview_theme: (data) => {
      utils.applyTheme(data);
    },
    current_theme_updated: (data) => {
      utils.applyTheme(data);
      store.setCurrentTheme(data);
    },
    settings_config_updated: ({ data }) => {
      store.setSettingsConfig(data);
    },
    timer_config_updated: ({ data }) => store.setTimerConfig(data),
    theme_updated: ({ data: id }) => {
      ipc.getTheme(id).then((data) => {
        if (store.currentTheme?.id === id) {
          ipc.setCurrentTheme(data);
        } else if (store.getIdleTheme()?.id === id) {
          ipc.setIdleTheme(data);
        } else if (store.getFocusTheme()?.id === id) {
          ipc.setFocusTheme(data);
        } else if (store.getBreakTheme()?.id === id) {
          ipc.setBreakTheme(data);
        } else if (store.getLongBreakTheme()?.id === id) {
          ipc.setLongBreakTheme(data);
        }

        store.patchTheme(data.id, data);
      });
    },
  });

  React.useEffect(() => {
    ipc.getCurrentTheme().then((data) => {
      utils.applyTheme(data);
      store.setCurrentTheme(data);
    });
    ipc.getSettingsConfig().then((data) => store.setSettingsConfig(data));
  }, []);

  if (!store.currentTheme) return null;

  return (
    <WindowProvider>
      {props.children}

      <Toaster
        position="top-center"
        containerStyle={{ top: 4, zIndex: 999999999 }}
        toastOptions={{
          duration: 2400,
          style: {
            padding: 1,
            paddingInline: 2,
            backgroundColor: "rgb(var(--window-color))",
            borderBottomWidth: 2,
            borderColor: "rgb(var(--primary-color) / 0.8)",
            borderRadius: 4,
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "rgb(var(--primary-color))",
            textAlign: "center",
          },
        }}
      />
    </WindowProvider>
  );
};
