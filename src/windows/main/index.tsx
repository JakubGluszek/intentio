import React from "react";
import {
  MdTimer,
  MdRemove,
  MdClose,
  MdSettings,
  MdAnalytics,
} from "react-icons/md";
import { BiTargetLock } from "react-icons/bi";
import { WebviewWindow } from "@tauri-apps/api/window";

import ipc from "@/ipc";
import config from "@/config";
import { WindowContainer } from "@/components";
import { Button, Pane, Panels } from "@/ui";
import {
  MainWindowProvider,
  TimerContextProvider,
  TimerContext,
  MainWindowContext,
  MainWindowDisplay,
} from "@/contexts";

import IntentsView from "./intentsView";
import { TimerView } from "./TimerView";
import { SessionSummary } from "./SessionSummary";

const MainWindow: React.FC = () => {
  return (
    <MainWindowProvider>
      <TimerContextProvider>
        <WindowContainer>
          <div className="grow flex flex-col gap-0.5">
            <Titlebar />
            <Content />
          </div>
        </WindowContainer>
      </TimerContextProvider>
    </MainWindowProvider>
  );
};

export const Content: React.FC = () => {
  const [viewIntent, setViewIntent] = React.useState(false);

  const timerCtx = React.useContext(TimerContext)!;
  const windowCtx = React.useContext(MainWindowContext)!;

  if (timerCtx.config.session_summary && timerCtx.sessionForCreate) {
    return (
      <SessionSummary
        data={timerCtx.sessionForCreate}
        onExit={() => timerCtx.clearSessionForCreate()}
      />
    );
  }

  return (
    <Pane className="relative grow flex flex-col gap-0.5 p-0.5">
      {!timerCtx.isPlaying && (
        <Panels
          value={windowCtx.display}
          onChange={(value) => windowCtx.setDisplay(value as MainWindowDisplay)}
        >
          <Panels.Panel value="Timer">
            <MdTimer size={20} />
            <div>Timer</div>
          </Panels.Panel>
          <Panels.Panel value="Intents">
            <BiTargetLock size={20} />
            <div>Intents</div>
          </Panels.Panel>
        </Panels>
      )}

      {windowCtx.display === "Timer" && (
        <TimerView
          viewIntent={viewIntent}
          toggleViewIntent={() => setViewIntent((prev) => !prev)}
        />
      )}
      {windowCtx.display === "Intents" && (
        <IntentsView onExit={() => windowCtx.setDisplay("Timer")} />
      )}
    </Pane>
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
      <div className="font-bold text-lg">Intentio</div>
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
