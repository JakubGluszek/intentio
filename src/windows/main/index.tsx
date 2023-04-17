import React from "react";
import { MdRemove, MdClose, MdSettings } from "react-icons/md";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { WebviewWindow } from "@tauri-apps/api/window";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import ipc from "@/ipc";
import useStore from "@/store";
import config from "@/config";
import { WindowContainer } from "@/components";
import { MainWindowContext, MainWindowProvider } from "@/contexts";
import TimerView from "./TimerView";
import Sidebar from "./sidebar";
import { useEvents, useTimer } from "@/hooks";
import utils from "@/utils";
import { Button } from "@/ui";

const MainWindow: React.FC = () => {
  const store = useStore();

  const timer = useTimer(store.timerConfig, {
    onStateUpdate: (state) =>
      ipc.updateTimerState({
        session_type: state.type,
        is_playing: state.isPlaying,
      }),
    onSaveSession: (session) => {
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
    },
    onCompleted: (session) => {
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

  React.useEffect(() => {
    ipc.getTimerConfig().then((data) => store.setTimerConfig(data));
    ipc.getScripts().then((data) => store.setScripts(data));
  }, []);

  useEvents({ script_updated: (data) => store.patchScript(data.id, data) });

  if (!store.timerConfig) return null;

  return (
    <MainWindowProvider>
      <WindowContainer>
        <motion.div
          className="grow flex flex-col gap-0.5"
          transition={{ duration: 0.2 }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Titlebar />
          <div className="grow flex flex-row">
            <Sidebar />
            <TimerView data={timer} />
          </div>
        </motion.div>
      </WindowContainer>
    </MainWindowProvider>
  );
};

const Titlebar: React.FC = () => {
  const { display, isCompact, toggleDisplay } =
    React.useContext(MainWindowContext)!;

  return (
    <div className="z-[1000] w-full flex flex-row items-center justify-between window rounded rounded-b-none overflow-clip">
      <div className="flex flex-row">
        <Button variant="ghost" onClick={toggleDisplay}>
          <motion.div animate={{ rotateZ: display === "sidebar" ? 180 : 0 }}>
            <TbLayoutSidebarRightCollapse size={isCompact ? 20 : 28} />
          </motion.div>
        </Button>
        <Button
          variant="ghost"
          onClick={() => new WebviewWindow("settings", config.windows.settings)}
        >
          <MdSettings size={isCompact ? 20 : 28} />
        </Button>
      </div>
      <h2 className="text-text/80 font-bold">Intentio</h2>
      <div className="flex flex-row">
        <Button variant="ghost" onClick={() => ipc.hideMainWindow()}>
          <MdRemove size={isCompact ? 20 : 28} />
        </Button>
        <Button variant="ghost" onClick={() => ipc.exitMainWindow()}>
          <MdClose size={isCompact ? 20 : 28} />
        </Button>
      </div>
    </div>
  );
};

export default MainWindow;
