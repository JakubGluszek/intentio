import React from "react";
import { MdRemove, MdClose, MdSettings } from "react-icons/md";
import { TbLayoutSidebarRightCollapse, TbMinimize } from "react-icons/tb";
import { BiTargetLock } from "react-icons/bi";
import { appWindow, LogicalSize, WebviewWindow } from "@tauri-apps/api/window";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";

import ipc from "@/ipc";
import useStore from "@/store";
import config from "@/config";
import { TimerSession } from "@/types";
import utils from "@/utils";
import { Button } from "@/components";
import { useEvents } from "@/hooks";
import { useTimer } from "@/hooks/useTimer";
import WindowContainer from "@/components/WindowContainer";
import { TimerConfig } from "@/bindings/TimerConfig";
import TimerView from "./TimerView";
import Sidebar from "./sidebar";
import { clsx } from "@mantine/core";

const MainWindow: React.FC = () => {
  const [displaySidebar, setDisplaySidebar] = React.useState(false);
  const [compact, setCompact] = React.useState(false);

  const store = useStore();

  const toggleSidebar = () => {
    if (!displaySidebar) {
      let size = new LogicalSize(
        config.webviews.main.width,
        config.webviews.main.height
      );
      appWindow.setMinSize(size);
      appWindow.setMaxSize(size);
      appWindow.setSize(size);
      setCompact(false);
    }
    setDisplaySidebar(!displaySidebar);
  };

  const toggleCompact = () => {
    if (compact) {
      let size = new LogicalSize(
        config.webviews.main.width,
        config.webviews.main.height
      );
      appWindow.setMinSize(size);
      appWindow.setMaxSize(size);
      appWindow.setSize(size);
    } else {
      // as for now, this doesn't work properly on linux; height is set to 200px for some reason ¯\_(ツ)_/¯
      let size = new LogicalSize(config.webviews.main.width, 200);
      appWindow.setMinSize(size);
      appWindow.setMaxSize(size);
      appWindow.setSize(size);
    }
    setCompact(!compact);
  };

  React.useEffect(() => {
    ipc.getTimerConfig().then((data) => store.setTimerConfig(data));
    ipc.getScripts().then((data) => store.setScripts(data));
    ipc.getInterfaceConfig().then((data) => store.setInterfaceConfig(data));
  }, []);

  useEvents({
    timer_config_updated: (data) => store.setTimerConfig(data),
    interface_config_updated: (data) => store.setInterfaceConfig(data),
  });

  if (!store.timerConfig) return null;

  return (
    <WindowContainer>
      <div className="grow flex flex-col gap-0.5 rounded overflow-clip">
        <Titlebar
          compact={compact}
          displaySidebar={displaySidebar}
          toggleSidebar={toggleSidebar}
        />
        <div className="grow flex flex-row">
          <Sidebar display={displaySidebar} toggleSidebar={toggleSidebar} />
          <Content
            display={!displaySidebar}
            compact={compact}
            toggleCompact={toggleCompact}
            timerConfig={store.timerConfig}
          />
        </div>
      </div>
    </WindowContainer>
  );
};

interface TitlebarProps {
  compact: boolean;
  displaySidebar: boolean;
  toggleSidebar: () => void;
}

const Titlebar: React.FC<TitlebarProps> = (props) => {
  return (
    <div className="w-full flex flex-row items-center justify-between bg-window/90 border-2 border-base/80 rounded overflow-clip">
      <div className="flex flex-row">
        <Button onClick={props.toggleSidebar} transparent rounded={false}>
          <motion.div animate={{ rotateZ: props.displaySidebar ? 180 : 0 }}>
            <TbLayoutSidebarRightCollapse size={props.compact ? 20 : 28} />
          </motion.div>
        </Button>
        <Button
          transparent
          onClick={() =>
            new WebviewWindow("settings", config.webviews.settings)
          }
          rounded={false}
        >
          <MdSettings size={props.compact ? 20 : 28} />
        </Button>
      </div>
      <h2 className="text-text/80 font-bold">Intentio</h2>
      <div className="flex flex-row">
        <Button
          transparent
          onClick={() => ipc.hideMainWindow()}
          rounded={false}
        >
          <MdRemove size={props.compact ? 20 : 28} />
        </Button>
        <Button
          transparent
          onClick={() => ipc.exitMainWindow()}
          rounded={false}
        >
          <MdClose size={props.compact ? 20 : 28} />
        </Button>
      </div>
    </div>
  );
};

interface ContentProps {
  display: boolean;
  compact: boolean;
  toggleCompact: () => void;
  timerConfig: TimerConfig;
}

const Content: React.FC<ContentProps> = (props) => {
  const store = useStore();

  const timer = useTimer(props.timerConfig, {
    onCompleted: (session: Partial<TimerSession>) => {
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
    },
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
    <AnimatePresence initial={false}>
      {props.display && (
        <motion.div
          className="grow flex flex-col gap-0.5"
          transition={{ duration: 0.3 }}
          initial={{ width: "0%", opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          exit={{ width: "0%", opacity: 0, translateX: 128 }}
        >
          <TimerView
            compact={props.compact}
            theme={store.currentTheme!}
            displayTimeLeft={
              store.interfaceConfig?.display_timer_countdown ?? true
            }
            {...timer}
          />

          <div className="bottom-0 left-0 w-full flex flex-row items-center justify-between gap-0.5 bg-window/90 border-2 border-base/80 rounded overflow-clip">
            <span
              className={clsx(
                "text-primary/80 font-bold text-center",
                props.compact ? "p-0.5 text-sm" : "p-1.5"
              )}
            >
              #{timer.iterations}
            </span>
            {store.currentIntent ? (
              <div
                className={clsx(
                  "w-full flex flex-row items-center justify-center gap-1 text-text/80",
                  props.compact ? "p-0.5 text-sm" : "p-1.5"
                )}
              >
                <BiTargetLock size={props.compact ? 14 : 16} />
                <span>{store.currentIntent.label}</span>
              </div>
            ) : null}
            <div className="flex flex-row items-center gap-1">
              <Button transparent onClick={props.toggleCompact} rounded={false}>
                <TbMinimize size={props.compact ? 20 : 28} />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MainWindow;
