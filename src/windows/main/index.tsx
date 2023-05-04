import React from "react";
import { MdRemove, MdClose, MdSettings } from "react-icons/md";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { WebviewWindow } from "@tauri-apps/api/window";
import { motion } from "framer-motion";

import ipc from "@/ipc";
import config from "@/config";
import { WindowContainer } from "@/components";
import { MainWindowContext, MainWindowProvider } from "@/contexts";
import { Button, Pane } from "@/ui";
import Sidebar from "./sidebar";
import Timer from "./timer";

const MainWindow: React.FC = () => {
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
            <Timer />
          </div>
        </motion.div>
      </WindowContainer>
    </MainWindowProvider>
  );
};

const Titlebar: React.FC = () => {
  const { display, toggleDisplay } = React.useContext(MainWindowContext)!;

  return (
    <Pane className="flex flex-row items-center justify-between">
      <div className="flex flex-row gap-0.5">
        <Button variant="ghost" onClick={toggleDisplay}>
          <motion.div
            animate={{
              rotateZ: display === "sidebar" ? 180 : 0,
              transition: { duration: 0.3 },
            }}
          >
            <TbLayoutSidebarRightCollapse size={28} />
          </motion.div>
        </Button>
        <Button
          variant="ghost"
          onClick={() => new WebviewWindow("settings", config.windows.settings)}
        >
          <MdSettings size={28} />
        </Button>
      </div>
      <h2 className="font-bold text-text">Intentio</h2>
      <div className="flex flex-row gap-0.5">
        <Button variant="ghost" onClick={() => ipc.hideMainWindow()}>
          <MdRemove size={28} />
        </Button>
        <Button variant="ghost" onClick={() => ipc.exitMainWindow()}>
          <MdClose size={28} />
        </Button>
      </div>
    </Pane>
  );
};

export default MainWindow;
