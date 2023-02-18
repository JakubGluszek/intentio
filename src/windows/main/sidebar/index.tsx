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

import useStore from "@/store";
import config from "@/config";
import Button from "@/components/Button";
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

  const activeIntentId = useStore((state) => state.activeIntentId);

  React.useEffect(() => {
    if (!activeIntentId) setTab("intents");
  }, [activeIntentId]);

  return (
    <div
      className="z-[9999] left-0 top-0 fixed w-[286px] h-full flex flex-col bg-window transition-opacity"
      style={{
        boxShadow: "8px 16px 24px -8px rgba(0, 0, 0, 0.60)",
        zIndex: props.isVisible ? 9999 : -1,
        opacity: props.isVisible ? 1.0 : 0.0,
      }}
    >
      <div className="grow flex flex-col p-2 bg-darker/40">
        <Header onCollapse={() => props.collapse()} />
        <div className="grow flex flex-col py-1">
          {tab === "intents" ? <IntentsView /> : null}
          {tab === "tasks" ? <TasksView /> : null}
          {tab === "notes" ? <NotesView /> : null}
        </div>
        {activeIntentId ? (
          <Tabs value={tab} onChange={(value) => setTab(value)} />
        ) : null}
      </div>
    </div>
  );
};

interface HeaderProps {
  onCollapse: () => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <div className="w-full flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <Button transparent onClick={props.onCollapse}>
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
        onClick={() => new WebviewWindow("intents", config.webviews.intents)}
      >
        <MdOpenInNew size={28} />
      </Button>
    </div>
  );
};

interface TabsProps {
  value: Tab;
  onChange: (value: Tab) => void;
}

const Tabs: React.FC<TabsProps> = (props) => {
  const store = useStore();

  return (
    <div className="h-7 flex flex-row gap-0.5 rounded-sm overflow-clip">
      <Button
        rounded={false}
        style={{
          width: props.value === "intents" ? "100%" : "fit-content",
          paddingInline: 4,
        }}
        isSelected={props.value === "intents"}
        onClick={() => props.onChange("intents")}
      >
        <BiTargetLock size={24} />
        {props.value === "intents" ? <span>Intents</span> : undefined}
      </Button>
      {store.activeIntentId ? (
        <Button
          rounded={false}
          style={{
            width: props.value === "tasks" ? "100%" : "fit-content",
            paddingInline: 4,
          }}
          isSelected={props.value === "tasks"}
          onClick={() => props.onChange("tasks")}
        >
          <MdCheckBox size={24} />
          {props.value === "tasks" ? <span>Tasks</span> : undefined}
        </Button>
      ) : null}
      {store.activeIntentId ? (
        <Button
          rounded={false}
          style={{
            width: props.value === "notes" ? "100%" : "fit-content",
            paddingInline: 4,
          }}
          isSelected={props.value === "notes"}
          onClick={() => props.onChange("notes")}
        >
          <MdStickyNote2 size={24} />
          {props.value === "notes" ? <span>Notes</span> : undefined}
        </Button>
      ) : null}
    </div>
  );
};

export default Sidebar;
