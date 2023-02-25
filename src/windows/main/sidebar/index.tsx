import React from "react";
import { BiTargetLock } from "react-icons/bi";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import {
  MdCheckBox,
  MdOpenInNew,
  MdSettings,
  MdStickyNote2,
} from "react-icons/md";
import { WebviewWindow } from "@tauri-apps/api/window";
import { AnimatePresence, motion } from "framer-motion";

import useStore from "@/store";
import config from "@/config";
import { Button } from "@/components";
import IntentsView from "./IntentsView";
import TasksView from "./TasksView";
import NotesView from "./NotesView";

interface Props {
  isVisible: boolean;
  collapse: () => void;
}

type Tab = "intents" | "notes" | "tasks";

const Sidebar: React.FC<Props> = (props) => {
  const [tab, setTab] = React.useState<Tab>("intents");

  const store = useStore();

  React.useEffect(() => {
    if (!store.activeIntentId) setTab("intents");
  }, [store.activeIntentId]);

  return (
    <AnimatePresence>
      {props.isVisible && (
        <motion.div
          className="z-[9999] left-0 top-0 fixed h-full flex flex-col bg-window transition-opacity"
          style={{
            boxShadow: "8px 16px 24px -8px rgba(0, 0, 0, 0.60)",
            zIndex: props.isVisible ? 9999 : -1,
            opacity: props.isVisible ? 1.0 : 0.0,
          }}
          initial={{ width: 0 }}
          animate={{
            width: 300,
            transition: { duration: 0.3 },
          }}
          exit={{
            width: 0,
            translateX: -32,
            transition: { duration: 0.3, delay: 0.05 },
          }}
        >
          <div className="grow flex flex-col p-2 bg-darker/40">
            <motion.div
              className="grow flex flex-col"
              initial={{ opacity: 0 }}
              animate={{
                transition: { duration: 0.2, delay: 0.1 },
                opacity: 1,
              }}
              exit={{
                opacity: 0.0,
                transition: { duration: 0.2 },
              }}
            >
              {/* Header */}
              <div className="w-full flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-2">
                  <Button transparent onClick={() => props.collapse()}>
                    <TbLayoutSidebarLeftCollapse size={28} />
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
                <Button
                  transparent
                  onClick={() =>
                    new WebviewWindow("intents", config.webviews.intents)
                  }
                >
                  <MdOpenInNew size={28} />
                </Button>
              </div>

              {/* Content */}
              <div className="grow flex flex-col py-1">
                {tab === "intents" ? <IntentsView /> : null}
                {tab === "tasks" ? <TasksView /> : null}
                {tab === "notes" ? <NotesView /> : null}
              </div>

              {/* Tabs */}
              {store.activeIntentId ? (
                <div className="h-7 flex flex-row gap-0.5 rounded-sm overflow-clip animate-in slide-in-from-bottom-8 zoom-in-75">
                  <Button
                    className="transition-none"
                    rounded={false}
                    style={{
                      width: tab === "intents" ? "100%" : "fit-content",
                      paddingInline: 4,
                    }}
                    isSelected={tab === "intents"}
                    onClick={() => setTab("intents")}
                  >
                    <BiTargetLock size={24} />
                    {tab === "intents" ? <span>Intents</span> : undefined}
                  </Button>
                  {store.activeIntentId ? (
                    <Button
                      className="transition-none"
                      rounded={false}
                      style={{
                        width: tab === "tasks" ? "100%" : "fit-content",
                        paddingInline: 4,
                      }}
                      isSelected={tab === "tasks"}
                      onClick={() => setTab("tasks")}
                    >
                      <MdCheckBox size={24} />
                      {tab === "tasks" ? <span>Tasks</span> : undefined}
                    </Button>
                  ) : null}
                  {store.activeIntentId ? (
                    <Button
                      className="transition-none"
                      rounded={false}
                      style={{
                        width: tab === "notes" ? "100%" : "fit-content",
                        paddingInline: 4,
                      }}
                      isSelected={tab === "notes"}
                      onClick={() => setTab("notes")}
                    >
                      <MdStickyNote2 size={24} />
                      {tab === "notes" ? <span>Notes</span> : undefined}
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
