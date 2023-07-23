import React from "react";
import { move_window, Position } from "tauri-plugin-positioner-api";
import { appWindow } from "@tauri-apps/api/window";

import { WindowContainer } from "@/components";
import { NotificationView } from "@/features/notification";
import { useNotifications } from "@/features/notification/useNotifications";

const NotificationsWindow: React.FC = () => {
  const { data } = useNotifications();

  React.useEffect(() => {
    move_window(Position.BottomRight);
    appWindow.show();
  }, []);

  return (
    <WindowContainer>
      <div className="w-fit h-fit">
        {data.map((n, idx) => (
          <NotificationView key={idx} {...n} />
        ))}
      </div>
    </WindowContainer>
  );
};

export default NotificationsWindow;
