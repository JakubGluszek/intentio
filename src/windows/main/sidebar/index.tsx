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
  display: boolean;
  onSidebarCollapse: () => void;
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
      if (e.key === "Tab") props.onSidebarCollapse();
    };

    document.addEventListener("keydown", handleOnKeyDown);
    return () => document.removeEventListener("keydown", handleOnKeyDown);
  }, []);

  React.useEffect(() => {
    if (!store.activeIntentId) setTab("intents");
  }, [store.activeIntentId]);

  return (
    <AnimatePresence>
      {props.display && (
        <motion.div
          className="flex flex-row gap-0.5"
          style={{
            zIndex: props.display ? 9999 : -1,
            opacity: props.display ? 1.0 : 0.0,
            height: config.webviews.main.height - 84,
          }}
          initial={{ width: 0 }}
          animate={{
            width: 340,
            transition: { duration: 0.3 },
          }}
          exit={{
            width: 0,
            translateX: -32,
            transition: { duration: 0.3 },
          }}
        >
          {store.activeIntentId ? (
            <div className="w-[40px] flex flex-col gap-0.5 bg-window/90 border-2 border-darker/20 rounded">
              <Button
                transparent
                rounded={false}
                isSelected={tab === "intents"}
                onClick={() => setTab("intents")}
              >
                <BiTargetLock size={24} />
              </Button>
              {store.activeIntentId ? (
                <Button
                  transparent
                  rounded={false}
                  isSelected={tab === "tasks"}
                  onClick={() => setTab("tasks")}
                >
                  <MdCheckBox size={24} />
                </Button>
              ) : null}
              {store.activeIntentId ? (
                <Button
                  transparent
                  rounded={false}
                  isSelected={tab === "notes"}
                  onClick={() => setTab("notes")}
                >
                  <MdStickyNote2 size={24} />
                </Button>
              ) : null}
            </div>
          ) : null}

          <motion.div
            className="grow flex flex-col p-1.5 bg-window/90 rounded border-2 border-darker/20"
            initial={{ width: 0 }}
            animate={{
              transition: { duration: 0.2 },
              width: 300,
            }}
            exit={{
              transition: { duration: 0.2 },
            }}
          >
            <div className="grow flex flex-col">
              {tab === "intents" ? <IntentsView /> : null}
              {tab === "tasks" ? <TasksView /> : null}
              {tab === "notes" ? <NotesView /> : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
