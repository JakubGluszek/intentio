import React from "react";
import { MdSettings, MdRemove, MdClose, MdSkipNext } from "react-icons/md";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { WebviewWindow } from "@tauri-apps/api/window";

import ipc from "@/ipc";
import useStore from "@/store";
import config from "@/config";
import { Button } from "@/components";
import Sidebar from "./sidebar";
import TimerView from "./timer";
import WindowContainer from "@/components/WindowContainer";
import { TimerState, useTimer } from "@/hooks/useTimer";
import { Intent } from "@/bindings/Intent";

const MainWindow: React.FC = () => {
  const [viewSidebar, setViewSidebar] = React.useState(false);

  return (
    <WindowContainer>
      <Titlebar
        onSidebarDisplay={() => setViewSidebar(true)}
        onSettingsOpen={() =>
          new WebviewWindow("settings", config.webviews.settings)
        }
        onWindowHide={() => ipc.hideMainWindow()}
        onWindowExit={() => ipc.exitMainWindow()}
      />
      <Body />
      <Sidebar
        display={viewSidebar}
        onSidebarCollapse={() => setViewSidebar(false)}
      />
    </WindowContainer>
  );
};

interface TitlebarProps {
  onSidebarDisplay: () => void;
  onSettingsOpen: () => void;
  onWindowHide: () => void;
  onWindowExit: () => void;
}

const Titlebar: React.FC<TitlebarProps> = (props) => {
  return (
    <div className="flex flex-row items-center justify-between p-1.5 bg-window">
      <div className="flex flex-row items-center gap-1">
        <Button transparent onClick={props.onSidebarDisplay}>
          <TbLayoutSidebarRightCollapse size={28} />
        </Button>
        <div>
          <Button transparent onClick={props.onSettingsOpen}>
            <MdSettings size={28} />
          </Button>
        </div>
      </div>
      <h1 className="text-text/80 font-bold">Intentio</h1>
      <div className="flex flex-row items-center gap-1">
        <div>
          <Button transparent onClick={props.onWindowHide}>
            <MdRemove size={28} />
          </Button>
        </div>
        <Button transparent onClick={props.onWindowExit}>
          <MdClose size={28} />
        </Button>
      </div>
    </div>
  );
};

interface BodyProps { }

const Body: React.FC<BodyProps> = (props) => {
  const [state, setState] = React.useState<TimerState>({
    duration: 2 * 60,
    elapsedTime: 0,
    isPlaying: false,
    iterations: 0,
    type: "focus",
  });

  const store = useStore();

  const timer = useTimer({
    state,
    onStateChange: (state) => setState(state),
    config: {
      focusDuration: 2 * 60,
      breakDuration: 1 * 60,
      longBreakDuration: 10 * 60,
      longBreakInterval: 4,
      autoStartBreak: false,
      autoStartFocus: false,
    },
  });

  const intent = store.getIntentById(timer.state.intentId);

  return (
    <div className="flex flex-col bg-window p-2">
      <TimerView
        variant="circle"
        theme={store.currentTheme!}
        displayTime={true}
        {...timer}
      />
      <Bottom
        intent={intent}
        iterations={timer.state.iterations}
        onSkip={timer.skip}
      />
    </div>
  );
};

interface BottomProps {
  intent?: Intent;
  iterations: number;
  onSkip: () => void;
}

const Bottom: React.FC<BottomProps> = (props) => {
  return (
    <div className="flex flex-row items-center justify-between bg-window p-1.5 py-1">
      <span className="text-primary/80 font-bold w-7 text-center">
        #{props.iterations}
      </span>
      {props.intent ? (
        <div className="w-full flex flex-row items-center gap-0.5 text-text/80">
          <span className="w-full text-center">{props.intent.label}</span>
        </div>
      ) : null}
      <div className="flex flex-row items-center gap-1">
        <Button
          transparent
          onClick={() => {
            props.onSkip();
          }}
        >
          <MdSkipNext size={28} />
        </Button>
      </div>
    </div>
  );
};

export default MainWindow;
