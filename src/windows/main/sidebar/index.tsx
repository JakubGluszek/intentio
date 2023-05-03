import React from "react";
import { BiTargetLock } from "react-icons/bi";
import { MdCheckBox, MdStickyNote2 } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

import useStore from "@/store";
import { MainWindowContext } from "@/contexts";
import IntentsView from "./intentsView";
import TasksView from "./tasksView";
import NotesView from "./notesView";
import { PaneButton } from "@/ui";

type Tab = "intents" | "notes" | "tasks";

const Sidebar: React.FC = () => {
  const [tab, setTab] = React.useState<Tab>("intents");

  const { display, toggleDisplay } = React.useContext(MainWindowContext)!;
  const store = useStore();

  // handles toggling sidebar via pressing 'Tab' key
  React.useEffect(() => {
    const handleOnKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") toggleDisplay();
    };

    document.addEventListener("keydown", handleOnKeyDown);
    return () => document.removeEventListener("keydown", handleOnKeyDown);
  }, []);

  React.useEffect(() => {
    if (!store.currentIntent) setTab("intents");
  }, [store.currentIntent]);

  return (
    <AnimatePresence mode="popLayout">
      {display === "sidebar" && (
        <motion.aside
          className="w-full h-full flex flex-row gap-0.5"
          transition={{ duration: 0.3, ease: "linear" }}
          initial={{ translateX: -300 }}
          animate={{ translateX: 0 }}
          exit={{
            width: "0%",
            translateX: -300,
          }}
        >
          <AnimatePresence>
            {store.currentIntent && (
              <motion.div
                className="h-full flex flex-col gap-0.5 overflow-clip"
                transition={{ duration: 0.075 }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 40, opacity: 1 }}
                exit={{ width: 0 }}
              >
                <PaneButton
                  active={tab === "intents"}
                  onClick={() => setTab("intents")}
                  icon={BiTargetLock}
                />
                <PaneButton
                  active={tab === "tasks"}
                  onClick={() => setTab("tasks")}
                  icon={MdCheckBox}
                />
                <PaneButton
                  active={tab === "notes"}
                  onClick={() => setTab("notes")}
                  icon={MdStickyNote2}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div
            className="grow flex flex-col"
            style={{ width: store.currentIntent ? 258 : undefined }} // needed to combat odd overflow caused by some children with 'w-full'
          >
            {tab === "intents" ? <IntentsView /> : null}
            {tab === "tasks" ? <TasksView /> : null}
            {tab === "notes" ? <NotesView /> : null}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
