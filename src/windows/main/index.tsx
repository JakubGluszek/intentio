import React from "react";
import { MdRemove, MdClose, MdSettings, MdAnalytics } from "react-icons/md";
import { WebviewWindow } from "@tauri-apps/api/window";

import ipc from "@/ipc";
import config from "@/config";
import { WindowContainer } from "@/components";
import { MainWindowProvider, TimerContextProvider } from "@/contexts";
import { Button, Pane } from "@/ui";
import { MainBody } from "./Body";

const MainWindow: React.FC = () => {
  return (
    <MainWindowProvider>
      <TimerContextProvider>
        <WindowContainer>
          <div className="grow flex flex-col gap-0.5">
            <Titlebar />
            <MainBody />
          </div>
        </WindowContainer>
      </TimerContextProvider>
    </MainWindowProvider>
  );
};

const Titlebar: React.FC = () => {
  return (
    <Pane className="flex flex-row items-center justify-between p-0">
      <div className="flex flex-row">
        <Button
          onClick={() => new WebviewWindow("settings", config.windows.settings)}
          variant="ghost"
          className="rounded-none"
        >
          <MdSettings size={24} />
        </Button>
        <Button
          onClick={() =>
            new WebviewWindow("analytics", config.windows.analytics)
          }
          variant="ghost"
          className="rounded-none"
        >
          <MdAnalytics size={24} />
        </Button>
      </div>
      <h2 className="font-bold text-text">Intentio</h2>
      <div className="flex flex-row">
        <Button
          onClick={() => ipc.hideMainWindow()}
          variant="ghost"
          className="rounded-none"
        >
          <MdRemove size={24} />
        </Button>
        <Button
          onClick={() => ipc.exitMainWindow()}
          variant="ghost"
          className="rounded-none"
        >
          <MdClose size={24} />
        </Button>
      </div>
    </Pane>
  );
};

export default MainWindow;
