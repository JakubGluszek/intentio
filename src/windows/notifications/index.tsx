import React from "react";
import { move_window, Position } from "tauri-plugin-positioner-api";

import { NotificationView } from "@/features/notification";
import { useNotifications } from "@/features/notification/useNotifications";
import useStore from "@/store";
import { useEvents, usePreventContextMenu } from "@/hooks";
import utils from "@/utils";
import ipc from "@/ipc";
import { WindowProvider } from "@/contexts";
import { appWindow, LogicalSize } from "@tauri-apps/api/window";

const NotificationsWindow: React.FC = () => {
  const store = useStore();

  usePreventContextMenu();

  useEvents({
    preview_theme: (data) => {
      utils.applyTheme(data);
    },
    current_theme_updated: (data) => {
      utils.applyTheme(data);
      store.setCurrentTheme(data);
    },
  });

  React.useEffect(() => {
    ipc.getCurrentTheme().then((data) => {
      utils.applyTheme(data);
      store.setCurrentTheme(data);
    });
  }, []);

  if (!store.currentTheme) return null;

  return (
    <WindowProvider>
      <Content />
    </WindowProvider>
  );
};

const Content: React.FC = () => {
  const { notification, closeNotification } = useNotifications();

  React.useEffect(() => {
    if (notification) {
      appWindow.show();
      appWindow.setSize(new LogicalSize(400, 64));
      appWindow.setResizable(false);
      appWindow.setCursorIcon("default");
      move_window(Position.TopCenter);
      return;
    }
    appWindow.hide();
  }, [notification]);

  if (!notification) return null;

  return (
    <div className="p-2 py-4">
      <NotificationView {...notification} onClose={closeNotification} />
    </div>
  );
};

export default NotificationsWindow;
