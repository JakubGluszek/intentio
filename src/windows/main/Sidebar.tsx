import React from "react";
import { BiTargetLock } from "react-icons/bi";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { MdCheckBox, MdOpenInNew, MdStickyNote2 } from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";
import { WebviewWindow } from "@tauri-apps/api/window";

import Button from "@/components/Button";
import QueueIcon from "@/components/QueueIcon";
import IntentsList from "../intents/IntentsList";
import { CONFIG } from "@/app/config";
import services from "@/app/services";
import { useStore } from "@/app/store";

interface Props {
  isVisible: boolean;
  collapse: () => void;
}

type Tab = "intents" | "tasks" | "notes";

const Sidebar: React.FC<Props> = (props) => {
  const [tab, setTab] = React.useState<Tab>("intents");
  const [selectedIntentTags, setSelectedIntentTags] = React.useState<string[]>(
    []
  );

  const ref = useClickOutside(() => props.collapse());

  const store = useStore();

  const onIntentChange = async (id: string | undefined) => {
    await services
      .setActiveIntentId(id)
      .then((data) => store.setActiveIntentId(data));
  };

  return (
    <div
      ref={ref}
      className="z-[9999] left-0 top-0 fixed w-[286px] h-full flex flex-col bg-window transition-opacity"
      style={{
        boxShadow: "8px 16px 24px -8px rgba(0, 0, 0, 0.60)",
        zIndex: props.isVisible ? 9999 : -1,
        opacity: props.isVisible ? 1.0 : 0.0,
      }}
    >
      <div className="grow flex flex-col gap-2 p-2 bg-darker/20">
        {/* Sidebar Operations */}
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <Button transparent onClick={props.collapse}>
              <TbLayoutSidebarLeftCollapse size={28} />
            </Button>
            <Button
              transparent
              onClick={() => {
                props.collapse();
              }}
            >
              <QueueIcon size={28} />
            </Button>
          </div>
          <Button
            transparent
            onClick={() => {
              new WebviewWindow("intents", CONFIG.webviews.intents);
              props.collapse();
            }}
          >
            <MdOpenInNew size={28} />
          </Button>
        </div>
        {/* Content */}
        <div className="grow flex flex-col gap-1">
          {tab === "intents" ? (
            <>
              {store.intents.length > 0 ? (
                <IntentsList
                  data={store.intents.filter(
                    (intent) =>
                      intent.archived_at === null ||
                      intent.archived_at === undefined
                  )}
                  selectedIntentId={store.activeIntentId}
                  selectedTags={selectedIntentTags}
                  onSelected={onIntentChange}
                  onTagSelected={(data) => setSelectedIntentTags(data)}
                />
              ) : (
                <div className="m-auto text-sm text-text/80 text-center">
                  <p>There are no defined intents</p>
                </div>
              )}
            </>
          ) : null}
          {tab === "tasks" ? <TasksView /> : null}
          {tab === "notes" ? <NotesView /> : null}
          {/* Content Navigation */}
          <div className="h-7 flex flex-row gap-0.5 rounded-sm overflow-clip">
            <Button
              primary={tab === "intents"}
              rounded={false}
              size={tab === "intents" ? "fill" : undefined}
              onClick={() => setTab("intents")}
            >
              <BiTargetLock size={24} />
              {tab === "intents" ? <span>Intents</span> : undefined}
            </Button>
            <Button
              size={tab === "tasks" ? "fill" : undefined}
              primary={tab === "tasks"}
              rounded={false}
              onClick={() => setTab("tasks")}
            >
              <MdCheckBox size={24} />
              {tab === "tasks" ? <span>Tasks</span> : undefined}
            </Button>
            <Button
              size={tab === "notes" ? "fill" : undefined}
              primary={tab === "notes"}
              rounded={false}
              onClick={() => setTab("notes")}
            >
              <MdStickyNote2 size={24} />
              {tab === "notes" ? <span>Notes</span> : undefined}
            </Button>
          </div>
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
