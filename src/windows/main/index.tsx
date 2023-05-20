import React from "react";
import { MdRemove, MdClose, MdSettings, MdAnalytics } from "react-icons/md";
import { MdTimer } from "react-icons/md";
import { BiTargetLock } from "react-icons/bi";
import { clsx } from "@mantine/core";
import { WebviewWindow } from "@tauri-apps/api/window";

import ipc from "@/ipc";
import config from "@/config";
import { WindowContainer } from "@/components";
import { Button, Pane } from "@/ui";
import {
  MainWindowProvider,
  TimerContextProvider,
  TimerContext,
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

const Content: React.FC = () => {
  const [display, setDisplay] = React.useState<"Timer" | "Intents">("Timer");

  const {
    config: timerConfig,
    sessionForCreate,
    clearSessionForCreate,
  } = React.useContext(TimerContext)!;

  // on "Tab" key press toggle display
  React.useEffect(() => {
    const handleOnKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab")
        setDisplay((prev) => (prev === "Timer" ? "Intents" : "Timer"));
    };

    document.addEventListener("keydown", handleOnKeyDown);
    return () => document.removeEventListener("keydown", handleOnKeyDown);
  }, []);

  if (timerConfig.session_summary && sessionForCreate) {
    return (
      <SessionSummary
        data={sessionForCreate}
        onExit={() => clearSessionForCreate()}
      />
    );
  }

  return (
    <Pane className="relative grow flex flex-col gap-0.5 p-0.5">
      {/* Main panel switcher */}
      <div className="flex flex-row bg-base/10 rounded-sm overflow-clip">
        <PanelButton
          active={display === "Timer"}
          onClick={() => setDisplay("Timer")}
        >
          <MdTimer size={20} />
          <div>Timer</div>
        </PanelButton>
        <PanelButton
          active={display === "Intents"}
          onClick={() => setDisplay("Intents")}
        >
          <BiTargetLock size={20} />
          <div>Intents</div>
        </PanelButton>
      </div>

      {display === "Timer" && <TimerView />}
      {display === "Intents" && (
        <IntentsView onExit={() => setDisplay("Timer")} />
      )}
    </Pane>
  );
};

interface PanelButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const PanelButton: React.FC<PanelButtonProps> = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={clsx(
        "flex-1 flex flex-row items-center justify-center gap-1 font-black p-0.5 transition-colors duration-150 uppercase",
        props.active
          ? "bg-primary/20 text-primary"
          : "bg-transparent text-base hover:text-primary hover:bg-base/10 active:bg-primary/10"
      )}
    >
      {props.children}
    </button>
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
