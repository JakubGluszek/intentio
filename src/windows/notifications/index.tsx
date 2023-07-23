import React from "react";
import { move_window, Position } from "tauri-plugin-positioner-api";
import { appWindow } from "@tauri-apps/api/window";

import { WindowContainer } from "@/components";

const NotificationsWindow: React.FC = () => {
  React.useEffect(() => {
    move_window(Position.BottomRight);
    appWindow.show();
  }, []);

  return (
    <WindowContainer>
      <Content />
    </WindowContainer>
  );
};

const Content: React.FC = () => {
  return <div className="w-fit h-fit">Notifications</div>;
};

export default NotificationsWindow;
