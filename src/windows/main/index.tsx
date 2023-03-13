import React from "react";
import { MdRemove, MdClose, MdSettings } from "react-icons/md";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { WebviewWindow } from "@tauri-apps/api/window";
import { AnimatePresence, motion } from "framer-motion";

import ipc from "@/ipc";
import useStore from "@/store";
import config from "@/config";
import { Button } from "@/components";
import { useEvents } from "@/hooks";
import { useTimer } from "@/hooks/useTimer";
import TimerView from "./timer";
import WindowContainer from "@/components/WindowContainer";
import Sidebar from "./sidebar";
import { TimerConfig } from "@/bindings/TimerConfig";
import { TimerSession } from "@/types";
import { toast } from "react-hot-toast";
import utils from "@/utils";

const MainWindow: React.FC = () => {
  const [displaySidebar, setDisplaySidebar] = React.useState(false);

  const store = useStore();

  const toggleSidebar = () => setDisplaySidebar((display) => !display);

  React.useEffect(() => {
    ipc.getTimerConfig().then((data) => store.setTimerConfig(data));
    ipc.getScripts().then((data) => store.setScripts(data));
  }, []);

  useEvents({
    timer_config_updated: (data) => store.setTimerConfig(data),
  });

  return (
    <WindowContainer>
      <div className="grow flex flex-col gap-0.5 rounded overflow-clip">
        <Titlebar
          displaySidebar={displaySidebar}
          toggleSidebar={toggleSidebar}
        />
        {store.timerConfig && (
          <Content
            timerConfig={store.timerConfig}
            displaySidebar={displaySidebar}
            toggleSidebar={toggleSidebar}
          />
        )}
      </div>
    </WindowContainer>
  );
};

interface TitlebarProps {
  displaySidebar: boolean;
  toggleSidebar: () => void;
}

const Titlebar: React.FC<TitlebarProps> = (props) => {
  return (
    <div className="flex flex-row">
      <div className="w-full flex flex-row items-center justify-between bg-window/90 border-2 border-base/80 rounded">
        <div className="flex flex-row gap-0.5">
          <Button transparent onClick={props.toggleSidebar}>
            <motion.div animate={{ rotateZ: props.displaySidebar ? 180 : 0 }}>
              <TbLayoutSidebarRightCollapse size={28} />
            </motion.div>
          </Button>
          <Button
            transparent
            onClick={() =>
              new WebviewWindow("settings", config.webviews.settings)
            }
          >
            <MdSettings size={28} />
          </Button>
        </div>
        <h2 className="text-text/80 font-bold">Intentio</h2>
        <div className="flex flex-row gap-0.5">
          <div>
            <Button transparent onClick={() => ipc.hideMainWindow()}>
              <MdRemove size={28} />
            </Button>
          </div>
          <Button transparent onClick={() => ipc.exitMainWindow()}>
            <MdClose size={28} />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ContentProps {
  timerConfig: TimerConfig;
  displaySidebar: boolean;
  toggleSidebar: () => void;
}

const Content: React.FC<ContentProps> = (props) => {
  const store = useStore();

  const onTimerComplete = (session: Partial<TimerSession>) => {
    if (
      session.type === "Focus" &&
      session.elapsedTime &&
      session.elapsedTime >= 60 &&
      session.startedAt
    ) {
      ipc
        .createSession({
          duration: ~~(session.elapsedTime! / 60),
          started_at: session.startedAt,
          intent_id: store.currentIntent?.id!,
        })
        .then(() => toast("Session saved"));
    }

    ipc.playAudio();

    store.scripts.forEach(
      (script) =>
        script.active &&
        (session.type === "Focus"
          ? script.run_on_session_end
          : script.run_on_break_end) &&
        utils.executeScript(script.body)
    );
  };

  const timer = useTimer(props.timerConfig, {
    onCompleted: onTimerComplete,
    onResumed: (session) => {
      store.scripts.forEach(
        (script) =>
          script.active &&
          (session.type === "Focus"
            ? script.run_on_session_start
            : script.run_on_break_start) &&
          utils.executeScript(script.body)
      );
    },
    onPaused: (session) => {
      store.scripts.forEach(
        (script) =>
          script.active &&
          (session.type === "Focus"
            ? script.run_on_session_pause
            : script.run_on_break_pause) &&
          utils.executeScript(script.body)
      );
    },
  });

  return (
    <div className="grow flex flex-row">
      <Sidebar
        display={props.displaySidebar}
        toggleSidebar={props.toggleSidebar}
      />
      <AnimatePresence>
        {!props.displaySidebar && (
          <motion.div
            className="flex flex-col gap-0.5"
            initial={{ width: "0%", opacity: 0 }}
            animate={{
              width: "100%",
              opacity: 1,
              transition: { duration: 0.3 },
            }}
            exit={{
              width: "0%",
              opacity: 0,
              translateX: 128,
              transition: { duration: 0.3 },
            }}
          >
            <TimerView
              variant="circle"
              theme={store.currentTheme!}
              displayTime={true}
              {...timer}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainWindow;
