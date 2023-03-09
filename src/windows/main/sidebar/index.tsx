import React from "react";
import { BiTargetLock } from "react-icons/bi";
import { MdCheckBox, MdStickyNote2 } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

import useStore from "@/store";
import { Button } from "@/components";
import { useEvents } from "@/hooks";
import ipc from "@/ipc";
import IntentsView from "./IntentsView";
import TasksView from "./TasksView";
import NotesView from "./NotesView";
import { toast } from "react-hot-toast";

interface Props {
  display: boolean;
  toggleSidebar: () => void;
}

type Tab = "intents" | "notes" | "tasks";

const Sidebar: React.FC<Props> = (props) => {
  const [tab, setTab] = React.useState<Tab>("intents");

  const store = useStore();

  useEvents({
    intent_created: (data) => store.addIntent(data),
    intent_updated: (data) => store.patchIntent(data.id, data),
    intent_deleted: (data) => {
      if (store.timerSession?.intent_id === data.id) {
        ipc
          .setTimerSession({ ...store.timerSession, intent_id: null })
          .then((data) => {
            store.setTimerSession(data);
            toast("Active intent has been deleted");
          });
      }

      store.removeIntent(data.id);
    },
    intent_archived: (data) => {
      if (store.timerSession?.intent_id === data.id) {
        ipc
          .setTimerSession({ ...store.timerSession, intent_id: null })
          .then((data) => {
            store.setTimerSession(data);
            toast("Active intent has been archived");
          });
      }

      store.patchIntent(data.id, data);
    },
    intent_unarchived: (data) => store.patchIntent(data.id, data),
  });

  React.useEffect(() => {
    ipc.getIntents().then((data) => store.setIntents(data));
  }, []);

  // handles toggling sidebar via pressing 'Tab' key
  React.useEffect(() => {
    const handleOnKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") props.toggleSidebar();
    };

    document.addEventListener("keydown", handleOnKeyDown);
    return () => document.removeEventListener("keydown", handleOnKeyDown);
  }, []);

  React.useEffect(() => {
    if (!store.timerSession?.intent_id) setTab("intents");
  }, [store.timerSession]);

  return (
    <AnimatePresence>
      {props.display && (
        <motion.div
          className="grow flex flex-row gap-0.5"
          initial={{ width: "0%", opacity: 0 }}
          animate={{
            width: "100%",
            opacity: 1,
            transition: { duration: 0.3 },
          }}
          exit={{
            width: "0%",
            opacity: 0,
            translateX: -128,
            transition: { duration: 0.3 },
          }}
        >
          {store.timerSession?.intent_id && (
            <div className="w-[40px] h-full flex flex-col gap-0.5">
              <div className="flex-1 bg-window/80 border-2 border-base/80 rounded">
                <Button
                  style={{ height: "100%", borderRadius: 2 }}
                  transparent
                  isSelected={tab === "intents"}
                  onClick={() => setTab("intents")}
                >
                  <BiTargetLock size={28} />
                </Button>
              </div>
              <div className="flex-1 bg-window/80 border-2 border-base/80 rounded">
                <Button
                  style={{ height: "100%", borderRadius: 2 }}
                  transparent
                  isSelected={tab === "tasks"}
                  onClick={() => setTab("tasks")}
                >
                  <MdCheckBox size={28} />
                </Button>
              </div>
              <div className="flex-1 bg-window/80 border-2 border-base/80 rounded">
                <Button
                  style={{ height: "100%", borderRadius: 2 }}
                  transparent
                  isSelected={tab === "notes"}
                  onClick={() => setTab("notes")}
                >
                  <MdStickyNote2 size={28} />
                </Button>
              </div>
            </div>
          )}
          {tab === "intents" ? <IntentsView /> : null}
          {tab === "tasks" ? <TasksView /> : null}
          {tab === "notes" ? <NotesView /> : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
