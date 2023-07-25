import React from "react";
import { move_window, Position } from "tauri-plugin-positioner-api";
import { appWindow } from "@tauri-apps/api/window";

import { NotificationView } from "@/features/notification";
import { useNotifications } from "@/features/notification/useNotifications";
import useStore from "@/store";
import { useEvents, usePreventContextMenu } from "@/hooks";
import utils from "@/utils";
import ipc from "@/ipc";
import { WindowProvider } from "@/contexts";

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
      appWindow.show().then(() => {
        move_window(Position.TopCenter);
      });
      return;
    }
    appWindow.hide();
  }, [notification]);

  if (!notification) return <div>Loading</div>;

  return <NotificationView {...notification} onClose={closeNotification} />;
};

export default NotificationsWindow;
