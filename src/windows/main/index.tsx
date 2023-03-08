import React from "react";
import { MdRemove, MdClose, MdSettings } from "react-icons/md";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { WebviewWindow } from "@tauri-apps/api/window";
import { AnimatePresence, motion } from "framer-motion";

import ipc from "@/ipc";
import useStore from "@/store";
import config from "@/config";
import { Button } from "@/components";
import TimerView from "./timer";
import WindowContainer from "@/components/WindowContainer";
import { TimerState, useTimer } from "@/hooks/useTimer";
import Sidebar from "./sidebar";

const MainWindow: React.FC = () => {
  const [displaySidebar, setDisplaySidebar] = React.useState(false);
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

  const intent = store.getActiveIntent();

  const toggleSidebar = () => setDisplaySidebar((display) => !display);

  return (
    <WindowContainer>
      <div className="grow flex flex-col gap-0.5 rounded overflow-clip">
        {/* Titlebar */}
        <div className="flex flex-row">
          <div className="w-full flex flex-row items-center justify-between bg-window/90 border-2 border-base/80 rounded">
            <div className="flex flex-row gap-0.5">
              <Button transparent onClick={toggleSidebar}>
                <motion.div animate={{ rotateZ: displaySidebar ? 180 : 0 }}>
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
        {/* Content */}
        <div className="grow flex flex-row">
          <Sidebar display={displaySidebar} toggleSidebar={toggleSidebar} />
          <AnimatePresence>
            {!displaySidebar && (
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
                  intent={intent}
                  {...timer}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </WindowContainer>
  );
};

export default MainWindow;
