import React from "react";
import { MdRemove, MdClose, MdSettings } from "react-icons/md";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { WebviewWindow } from "@tauri-apps/api/window";
import { motion } from "framer-motion";

import ipc from "@/ipc";
import useStore from "@/store";
import config from "@/config";
import { Button, WindowContainer } from "@/components";
import { useEvents } from "@/hooks";
import { MainWindowContext, MainWindowProvider } from "@/contexts";
import TimerView from "./TimerView";
import Sidebar from "./sidebar";

const MainWindow: React.FC = () => {
  const store = useStore();

  React.useEffect(() => {
    ipc.getTimerConfig().then((data) => store.setTimerConfig(data));
    ipc.getScripts().then((data) => store.setScripts(data));
    ipc.getInterfaceConfig().then((data) => store.setInterfaceConfig(data));
  }, []);

  useEvents({
    timer_config_updated: (data) => store.setTimerConfig(data),
    interface_config_updated: (data) => store.setInterfaceConfig(data),
  });

  if (!store.timerConfig || !store.interfaceConfig) return null;

  return (
    <MainWindowProvider>
      <WindowContainer>
        <motion.div
          className="grow flex flex-col gap-0.5 rounded"
          transition={{ duration: 0.2 }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Titlebar />
          <div className="grow flex flex-row overflow-clip">
            <Sidebar />
            <TimerView config={store.timerConfig} />
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
        <Button onClick={toggleDisplay} transparent rounded={false}>
          <motion.div animate={{ rotateZ: display === "sidebar" ? 180 : 0 }}>
            <TbLayoutSidebarRightCollapse size={isCompact ? 20 : 28} />
          </motion.div>
        </Button>
        <Button
          transparent
          onClick={() => new WebviewWindow("settings", config.windows.settings)}
          rounded={false}
        >
          <MdSettings size={isCompact ? 20 : 28} />
        </Button>
      </div>
      <h2 className="text-text/80 font-bold">Intentio</h2>
      <div className="flex flex-row">
        <Button
          transparent
          onClick={() => ipc.hideMainWindow()}
          rounded={false}
        >
          <MdRemove size={isCompact ? 20 : 28} />
        </Button>
        <Button
          transparent
          onClick={() => ipc.exitMainWindow()}
          rounded={false}
        >
          <MdClose size={isCompact ? 20 : 28} />
        </Button>
      </div>
    </div>
  );
};

export default MainWindow;
