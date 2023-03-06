import React from "react";
import { MdSettings, MdRemove, MdClose, MdSkipNext } from "react-icons/md";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { WebviewWindow } from "@tauri-apps/api/window";
import { motion } from "framer-motion";

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

  React.useEffect(() => {
    ipc.getActiveIntentId().then((data) => store.setActiveIntentId(data));
  }, []);

  return (
    <WindowContainer>
      <div className="grow flex flex-col gap-0.5 rounded overflow-clip">
        <Titlebar
          isSidebar={viewSidebar}
          toggleSidebar={() => setViewSidebar((view) => !view)}
          onSettingsOpen={() =>
            new WebviewWindow("settings", config.webviews.settings)
          }
          onWindowHide={() => ipc.hideMainWindow()}
          onWindowExit={() => ipc.exitMainWindow()}
        />
        <div className="grow flex flex-row">
          {!viewSidebar && (
            <TimerView
              variant="circle"
              theme={store.currentTheme!}
              displayTime={true}
              intent={intent}
              {...timer}
            />
          )}

          {viewSidebar && (
            <Sidebar
              display={viewSidebar}
              onSidebarCollapse={() => setViewSidebar(false)}
            />
          )}
        </div>
        <Bottom
          intent={intent}
          iterations={timer.state.iterations}
          onSkip={timer.skip}
        />
      </div>
    </WindowContainer>
  );
};

interface TitlebarProps {
  isSidebar: boolean;
  toggleSidebar: () => void;
  onSettingsOpen: () => void;
  onWindowHide: () => void;
  onWindowExit: () => void;
}

const Titlebar: React.FC<TitlebarProps> = (props) => {
  return (
    <div className="flex flex-row items-center justify-between bg-window/80 border-2 border-darker/20 rounded">
      <div className="flex flex-row">
        <motion.div
          animate={{ rotateZ: props.isSidebar ? 180 : 0 }}
          transition={{}}
        >
          <Button highlight transparent onClick={props.toggleSidebar}>
            {<TbLayoutSidebarRightCollapse size={28} />}
          </Button>
        </motion.div>
        <div>
          <Button transparent onClick={props.onSettingsOpen}>
            <MdSettings size={28} />
          </Button>
        </div>
      </div>
      <h1 className="text-text/80 font-bold">Intentio</h1>
      <div className="flex flex-row">
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

interface BottomProps {
  intent?: Intent;
  iterations: number;
  onSkip: () => void;
}

const Bottom: React.FC<BottomProps> = (props) => {
  return (
    <div className="flex flex-row items-center justify-between bg-window/80 border-2 border-darker/20 rounded">
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
