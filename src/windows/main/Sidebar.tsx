import React from "react";
import { BiTargetLock } from "react-icons/bi";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { WebviewConfig } from "@/app/config";
import { useClickOutside } from "@mantine/hooks";
import { WebviewWindow } from "@tauri-apps/api/window";

import Button from "@/components/Button";
import QueueIcon from "@/components/QueueIcon";
import IntentsList from "../intents/IntentsList";
import { DUMMY_INTENTS } from "../intents/mockData";
import { MdCheckBox, MdOpenInNew, MdStickyNote2 } from "react-icons/md";
import { Intent } from "../intents";

interface Props {
  isVisible: boolean;
  collapse: () => void;
}

type Tab = "intents" | "tasks" | "notes";

const Sidebar: React.FC<Props> = (props) => {
  const [tab, setTab] = React.useState<Tab>("intents");
  const [selectedIntent, setSelectedIntent] = React.useState<Intent>();
  const [selectedIntentTags, setSelectedIntentTags] = React.useState<string[]>(
    []
  );

  const ref = useClickOutside(() => props.collapse());

  return (
    <div
      ref={ref}
      className="z-[9999] left-0 top-0 fixed w-[264px] h-full flex flex-col gap-4 p-4 bg-window transition-opacity"
      style={{
        boxShadow: "8px 16px 24px -8px rgba(0, 0, 0, 0.60)",
        zIndex: props.isVisible ? 9999 : -1,
        opacity: props.isVisible ? 1.0 : 0.0,
      }}
    >
      {/* Sidebar Operations */}
      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <Button transparent onClick={props.collapse}>
            <TbLayoutSidebarLeftCollapse size={32} />
          </Button>
          <Button
            transparent
            onClick={() => {
              new WebviewWindow("queues", {
                url: "/queues",
                title: "Queues",
                width: 450,
                height: 380,
                ...WebviewConfig,
              });
              props.collapse();
            }}
          >
            <QueueIcon size={32} />
          </Button>
        </div>
        <Button
          transparent
          onClick={() => {
            new WebviewWindow("intents", {
              url: "/intents",
              title: "Intents",
              width: 640,
              height: 480,
              maxWidth: 640,
              maxHeight: 480,
              ...WebviewConfig,
            });
            props.collapse();
          }}
        >
          <MdOpenInNew size={32} />
        </Button>
      </div>
      {/* Content */}
      <div className="grow flex flex-col gap-1">
        {tab === "intents" ? (
          <IntentsList
            data={DUMMY_INTENTS}
            selectedIntent={selectedIntent}
            selectedTags={selectedIntentTags}
            onSelected={(data) => setSelectedIntent(data)}
            onTagSelected={(data) => setSelectedIntentTags(data)}
          />
        ) : null}
        {tab === "tasks" ? <TasksView /> : null}
        {tab === "notes" ? <NotesView /> : null}
        {/* Content Navigation */}
        <div className="h-8 flex flex-row gap-0.5 rounded overflow-clip">
          <Button
            size={tab === "intents" ? "fill" : undefined}
            color={tab === "intents" ? "primary" : undefined}
            onClick={() => setTab("intents")}
            style={{ borderRadius: 0 }}
          >
            <BiTargetLock size={28} />
            {tab === "intents" ? (
              <span className="text-lg font-black">Intents</span>
            ) : undefined}
          </Button>
          <Button
            size={tab === "tasks" ? "fill" : undefined}
            color={tab === "tasks" ? "primary" : undefined}
            onClick={() => setTab("tasks")}
            style={{ borderRadius: 0 }}
          >
            <MdCheckBox size={28} />
            {tab === "tasks" ? (
              <span className="text-lg">Tasks</span>
            ) : undefined}
          </Button>
          <Button
            size={tab === "notes" ? "fill" : undefined}
            color={tab === "notes" ? "primary" : undefined}
            onClick={() => setTab("notes")}
            style={{ borderRadius: 0 }}
          >
            <MdStickyNote2 size={28} />
            {tab === "notes" ? (
              <span className="text-lg">Notes</span>
            ) : undefined}
          </Button>
        </div>
      </div>
    </div>
  );
};

const TasksView: React.FC = () => {
  return <div className="grow flex flex-col">Tasks</div>;
};

const NotesView: React.FC = () => {
  return <div className="grow flex flex-col">Notes</div>;
};

export default Sidebar;
