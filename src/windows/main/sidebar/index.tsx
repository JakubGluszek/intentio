import React from "react";
import { BiTargetLock } from "react-icons/bi";
import { MdCheckBox, MdStickyNote2 } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { IconType } from "react-icons";
import { clsx } from "@mantine/core";

import useStore from "@/store";
import { MainWindowContext } from "@/contexts";
import { Button, Pane } from "@/ui";
import IntentsView from "./intentsView";
import TasksView from "./tasksView";
import NotesView from "./notesView";

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
          className="h-[282px] flex flex-row gap-0.5"
          transition={{ duration: 0.3 }}
          initial={{ width: "0%", opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          exit={{
            width: "0%",
            opacity: 0,
            translateX: -128,
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
                <TabPane
                  active={tab === "intents"}
                  onClick={() => setTab("intents")}
                  icon={BiTargetLock}
                />
                <TabPane
                  active={tab === "tasks"}
                  onClick={() => setTab("tasks")}
                  icon={MdCheckBox}
                />
                <TabPane
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

interface TabPaneProps {
  active: boolean;
  icon: IconType;
  onClick: () => void;
}

const TabPane: React.FC<TabPaneProps> = (props) => {
  return (
    <Pane
      className={clsx("h-full hover:border-primary/50", props.active && "border-primary/50 hover:border-primary/60")}
      withPadding={false}
    >
      <Button
        className={clsx("h-full", props.active && "bg-primary/10 hover:bg-primary/20 text-primary/80 hover:text-primary")}
        variant="ghost"
        onClick={() => props.onClick()}
      >
        <props.icon size={28} />
      </Button>
    </Pane>
  );
};

export default Sidebar;
