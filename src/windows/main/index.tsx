import React from "react";
import {
  MdRemove,
  MdClose,
  MdSettings,
  MdAnalytics,
  MdCheckBox,
  MdHistory,
  MdTimer,
  MdArrowDropDown,
} from "react-icons/md";
import { BiTargetLock } from "react-icons/bi";
import { IoMdStats } from "react-icons/io";
import { AiFillControl } from "react-icons/ai";
import { WebviewWindow } from "@tauri-apps/api/window";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "@mantine/core";

import ipc from "@/ipc";
import config, { WebviewConfig } from "@/config";
import { WindowContainer } from "@/components";
import { Button, Pane, Panels } from "@/ui";
import {
  MainWindowProvider,
  TimerContextProvider,
  TimerContext,
  MainWindowContext,
} from "@/contexts";
import useStore from "@/store";

import IntentsView from "./intentsView";
import TasksView from "./tasksView";
import { TimerView } from "./TimerView";
import { StatsView } from "./StatsView";
import { ConfigView } from "./ConfigView";
import { HistoryView } from "./HistoryView";

const MainWindow: React.FC = () => {
  return (
    <MainWindowProvider>
      <TimerContextProvider>
        <WindowContainer>
          <Pane className="grow flex flex-col gap-0.5">
            <Titlebar />
            <Content />
          </Pane>
        </WindowContainer>
      </TimerContextProvider>
    </MainWindowProvider>
  );
};

type PanelType = "Timer" | "Stats" | "Tasks" | "History" | "Config" | string;

export const Content: React.FC = () => {
  const [panel, setPanel] = React.useState<PanelType>("Timer");
  const [viewIntents, setViewIntents] = React.useState(false);

  const timerCtx = React.useContext(TimerContext)!;
  const windowCtx = React.useContext(MainWindowContext)!;

  const store = useStore();
  const intent = store.currentIntent;

  React.useEffect(() => {
    if (timerCtx.config.session_summary && timerCtx.sessionForCreate) {
      windowCtx.setDisplay("Summary");
    }
  }, [timerCtx.sessionForCreate]);

  React.useEffect(() => {
    intent && setViewIntents((prev) => (prev === true ? false : prev));
  }, [intent]);

  return (
    <div className="relative grow flex flex-col gap-0.5 rounded-sm overflow-clip">
      {/* Intent Heading */}
      <div
        className={clsx(
          "relative h-7 w-full flex flex-row items-center bg-base/5 gap-1 text-sm",
          !viewIntents && "justify-center"
        )}
      >
        <motion.div
          key={viewIntents ? 1 : 0}
          className="flex flex-row items-center gap-1 font-bold uppercase text-text/90"
          transition={{ duration: 0.4 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <BiTargetLock size={20} />
          {viewIntents ? "Intents" : intent ? intent.label : "Select Intent"}
        </motion.div>

        <Button
          variant="ghost"
          className="absolute right-0 top-0 rounded-none"
          onClick={() => setViewIntents((prev) => !prev)}
        >
          <motion.div
            transition={{ duration: 0.4 }}
            animate={{ rotateZ: viewIntents ? 180 : 0 }}
          >
            <MdArrowDropDown size={20} />
          </motion.div>
        </Button>
      </div>

      <div className="grow flex flex-col gap-0.5">
        <AnimatePresence mode="wait">
          {viewIntents ? (
            <motion.div
              key={1}
              className="grow flex flex-col"
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <IntentsView />
            </motion.div>
          ) : (
            <motion.div
              key={2}
              className="grow flex flex-col"
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <AnimatePresence initial={false} mode="wait">
                {panel === "Stats" && <StatsView display={panel === "Stats"} />}
                {panel === "Tasks" && <TasksView display={panel === "Tasks"} />}
                {panel === "History" && (
                  <HistoryView display={panel === "History"} />
                )}
                {panel === "Config" && (
                  <ConfigView display={panel === "Config"} />
                )}
                {panel === "Timer" && <TimerView display={true} />}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Current intent's actions */}
          {!viewIntents && intent && (
            <motion.div
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Panels value={panel} onChange={(value) => setPanel(value)}>
                <Panels.Panel value="Stats">
                  <IoMdStats size={20} />
                </Panels.Panel>
                <Panels.Panel value="Tasks">
                  <MdCheckBox size={20} />
                </Panels.Panel>
                <Panels.Panel value="Timer">
                  <MdTimer size={20} />
                </Panels.Panel>
                <Panels.Panel value="History">
                  <MdHistory size={20} />
                </Panels.Panel>
                <Panels.Panel value="Config">
                  <AiFillControl size={20} />
                </Panels.Panel>
                <Button
                  variant="ghost"
                  onClick={() =>
                    new WebviewWindow("test-timer-window", {
                      url: "/timer",
                      title: "Test Timer Window",
                      width: 400,
                      height: 400,
                      ...WebviewConfig,
                    })
                  }
                >
                  <MdTimer size={20} />
                </Button>
              </Panels>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Titlebar: React.FC = () => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row">
        <Button
          onClick={() => new WebviewWindow("settings", config.windows.settings)}
          variant="ghost"
        >
          <MdSettings size={20} />
        </Button>
        <Button
          onClick={() =>
            new WebviewWindow("analytics", config.windows.analytics)
          }
          variant="ghost"
        >
          <MdAnalytics size={20} />
        </Button>
      </div>
      <div className="font-bold">Intentio</div>
      <div className="flex flex-row">
        <Button onClick={() => ipc.hideMainWindow()} variant="ghost">
          <MdRemove size={20} />
        </Button>
        <Button onClick={() => ipc.exitMainWindow()} variant="ghost">
          <MdClose size={20} />
        </Button>
      </div>
    </div>
  );
};

export default MainWindow;
