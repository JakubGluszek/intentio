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
import { useEvents } from "@/hooks";
import ipc from "@/ipc";
import { toast } from "react-hot-toast";

interface Props {
  isVisible: boolean;
  toggle: () => void;
}

type Tab = "intents" | "notes" | "tasks";

const Sidebar: React.FC<Props> = (props) => {
  const [tab, setTab] = React.useState<Tab>("intents");

  const store = useStore();

  useEvents({
    active_intent_id_updated: (data) => {
      store.setActiveIntentId(data.active_intent_id);
    },
    intent_created: (data) => store.addIntent(data),
    intent_updated: (data) => store.patchIntent(data.id, data),
    intent_deleted: (data) => {
      if (store.activeIntentId === data.id) {
        ipc.setActiveIntentId(undefined).then(() => {
          store.setActiveIntentId(undefined);
          toast("Active intent has been deleted");
        });
      }

      store.removeIntent(data.id);
    },
    intent_archived: (data) => {
      if (store.activeIntentId === data.id) {
        ipc.setActiveIntentId(undefined).then(() => {
          store.setActiveIntentId(undefined);
          toast("Active intent has been archived");
        });
      }

      store.patchIntent(data.id, data);
    },
    intent_unarchived: (data) => store.patchIntent(data.id, data),
  });

  React.useEffect(() => {
    ipc.getIntents().then((data) => store.setIntents(data));
    ipc.getActiveIntentId().then((data) => store.setActiveIntentId(data));
  }, []);

  // handles toggling sidebar via pressing 'Tab' key
  React.useEffect(() => {
    const handleOnKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") props.toggle();
    };

    document.addEventListener("keydown", handleOnKeyDown);
    return () => document.removeEventListener("keydown", handleOnKeyDown);
  }, []);

  React.useEffect(() => {
    if (!store.activeIntentId) setTab("intents");
  }, [store.activeIntentId]);

  return (
    <AnimatePresence>
      {props.isVisible && (
        <motion.div
          className="z-[9999] fixed flex flex-col bg-window transition-opacity inset-0.5"
          style={{
            boxShadow: "8px 16px 24px -8px rgba(0, 0, 0, 0.60)",
            zIndex: props.isVisible ? 9999 : -1,
            opacity: props.isVisible ? 1.0 : 0.0,
            height: config.webviews.main.height - 4,
          }}
          initial={{ width: 0 }}
          animate={{
            width: 296,
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
                  <Button transparent onClick={() => props.toggle()}>
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
