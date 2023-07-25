import React from "react";

import { WindowContainer } from "@/components";
import { appWindow } from "@tauri-apps/api/window";
import { move_window, Position } from "tauri-plugin-positioner-api";

const TinyTimerWindow: React.FC = () => {
  return (
    <WindowContainer>
      <Content />
    </WindowContainer>
  );
};

const Content: React.FC = () => {
  return <Container>Tiny Timer</Container>;
};

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  React.useEffect(() => {
    appWindow.show();
    move_window(Position.Center);
  }, []);

  return (
    <div className="w-[15rem] h-[5rem]">
      <div className="relative w-full h-full flex flex-col bg-window/95 border-2 border-base/5 rounded-md overflow-clip">
        {children}
      </div>
    </div>
  );
};

export default TinyTimerWindow;
