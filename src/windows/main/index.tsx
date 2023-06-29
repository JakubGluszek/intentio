import React from "react";
import { MdAnalytics, MdClose, MdRemove, MdSettings } from "react-icons/md";

import { WindowContainer } from "@/components";
import { Button, IconView } from "@/ui";
import { IntentsView } from "./IntentsView";
import { WebviewWindow } from "@tauri-apps/api/window";
import config from "@/config";
import ipc from "@/ipc";

const MainWindow: React.FC = () => {
  return (
    <WindowContainer>
      <Content />
    </WindowContainer>
  );
};

const Content: React.FC = () => {
  return (
    <div className="w-[20rem] h-[21rem]">
      <div className="relative w-screen h-screen flex flex-col bg-window/95 border-2 border-primary/10 rounded-md overflow-clip">
        {/* Titlebar */}
        <div className="flex flex-row items-center h-8 p-0.5 bg-primary/10">
          <div className="flex flex-row gap-1">
            <Button
              variant="ghost"
              onClick={() =>
                new WebviewWindow("settings", config.windows.settings)
              }
            >
              <IconView icon={MdSettings} />
            </Button>
            <Button variant="ghost" disabled>
              <IconView icon={MdAnalytics} />
            </Button>
          </div>
          <div className="w-full text-center font-bold text-lg text-text/80">
            Intentio
          </div>
          <div className="flex flex-row gap-1">
            <Button variant="ghost" onClick={() => ipc.hideMainWindow()}>
              <IconView icon={MdRemove} />
            </Button>
            <Button variant="ghost" onClick={() => ipc.exitMainWindow()}>
              <IconView icon={MdClose} />
            </Button>
          </div>
        </div>

        <Main />
      </div>
    </div>
  );
};

const Main: React.FC = () => {
  return <IntentsView />;
};

export default MainWindow;
