import React from "react";
import { TiPin, TiPinOutline } from "react-icons/ti";
import { MdInfo } from "react-icons/md";
import clsx from "clsx";

import Button from "@/components/Button";
import { Intent } from ".";

interface Props {
  data: Intent;
}

const IntentDetails: React.FC<Props> = (props) => {
  const [tab, setTab] = React.useState<
    "activity" | "sessions" | "tasks" | "notes"
  >("activity");

  const { data } = props;

  return (
    <div className="grow flex flex-col gap-4 p-2 animate-in fade-in-0 duration-75">
      {/* Top */}
      <div className="w-full h-8 flex flex-row items-center justify-between">
        <div className="w-full overflow-hidden">
          <h1 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-lg">
            {data.label}
          </h1>
        </div>
        <div className="min-w-fit flex flex-row items-center gap-1">
          <Button transparent>
            {data.pinned ? <TiPin size={32} /> : <TiPinOutline size={32} />}
          </Button>
          <Button transparent>
            <MdInfo size={28} />
          </Button>
        </div>
      </div>
      <div className="grow flex flex-col gap-1">
        <div className="grow flex flex-col bg-base rounded">
          {tab === "activity" ? <ActivityView /> : null}
          {tab === "sessions" ? <SessionsView /> : null}
          {tab === "tasks" ? <TasksView /> : null}
          {tab === "notes" ? <NotesView /> : null}
        </div>
        <div className="w-full h-8 flex flex-row gap-0.5 rounded overflow-clip text-sm">
          <button
            onClick={() => setTab("activity")}
            className={clsx(
              "w-full uppercase tracking-wider",
              tab === "activity"
                ? "bg-primary/80 hover:bg-primary text-window"
                : "bg-base/80 hover:bg-base text-text"
            )}
          >
            Activity
          </button>
          <button
            onClick={() => setTab("sessions")}
            className={clsx(
              "w-full uppercase tracking-wider",
              tab === "sessions"
                ? "bg-primary/80 hover:bg-primary text-window"
                : "bg-base/80 hover:bg-base text-text"
            )}
          >
            Sessions
          </button>
          <button
            onClick={() => setTab("tasks")}
            className={clsx(
              "w-full uppercase tracking-wider",
              tab === "tasks"
                ? "bg-primary/80 hover:bg-primary text-window"
                : "bg-base/80 hover:bg-base text-text"
            )}
          >
            Tasks
          </button>
          <button
            onClick={() => setTab("notes")}
            className={clsx(
              "w-full uppercase tracking-wider",
              tab === "notes"
                ? "bg-primary/80 hover:bg-primary text-window"
                : "bg-base/80 hover:bg-base text-text"
            )}
          >
            Notes
          </button>
        </div>
      </div>
    </div>
  );
};

const ActivityView: React.FC = () => {
  return <div className="grow flex flex-col gap-2 p-2">Activity</div>;
};

const SessionsView: React.FC = () => {
  return <div className="grow flex flex-col gap-2 p-2">Sessions</div>;
};

const TasksView: React.FC = () => {
  return <div className="grow flex flex-col gap-2 p-2">Tasks</div>;
};

const NotesView: React.FC = () => {
  return <div className="grow flex flex-col gap-2 p-2">Notes</div>;
};

export default IntentDetails;
