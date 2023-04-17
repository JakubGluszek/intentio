import React from "react";
import { BiTargetLock } from "react-icons/bi";
import { MdCheckBox, MdStickyNote2 } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

import useStore from "@/store";
import { MainWindowContext } from "@/contexts";
import IntentsView from "./intentsView";
import TasksView from "./tasksView";
import NotesView from "./notesView";
import { Button } from "@/ui";

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
    <AnimatePresence>
      {display === "sidebar" && (
        <motion.aside
          className="h-[278px] flex flex-row gap-0.5 rounded-b overflow-clip"
          transition={{ duration: 0.3 }}
          initial={{ width: "0%", opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          exit={{
            width: "0%",
            opacity: 0,
            translateX: -128,
          }}
        >
          <TabsView
            display={store.currentIntent ? true : false}
            tab={tab}
            setTab={setTab}
          />
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

interface TabsViewProps {
  display: boolean;
  tab: Tab;
  setTab: (tab: Tab) => void;
}

const TabsView: React.FC<TabsViewProps> = (props) => {
  return (
    <AnimatePresence>
      {props.display && (
        <motion.div
          className="h-full flex flex-col gap-0.5 overflow-clip"
          transition={{ duration: 0.075 }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 40, opacity: 1 }}
          exit={{ width: 0 }}
        >
          <div className="h-full window">
            <Button
              variant="ghost"
              onClick={() => props.setTab("intents")}
              style={{
                height: "100%",
                backgroundColor:
                  props.tab === "intents"
                    ? "rgb(var(--primary-color) / 0.2)"
                    : undefined,
              }}
            >
              <BiTargetLock size={28} />
            </Button>
          </div>
          <div className="h-full window">
            <Button
              variant="ghost"
              onClick={() => props.setTab("tasks")}
              style={{
                height: "100%",
                backgroundColor:
                  props.tab === "tasks"
                    ? "rgb(var(--primary-color) / 0.2)"
                    : undefined,
              }}
            >
              <MdCheckBox size={28} />
            </Button>
          </div>
          <div className="h-full window">
            <Button
              variant="ghost"
              onClick={() => props.setTab("notes")}
              style={{
                height: "100%",
                backgroundColor:
                  props.tab === "notes"
                    ? "rgb(var(--primary-color) / 0.2)"
                    : undefined,
              }}
            >
              <MdStickyNote2 size={28} />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
