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
      <div className="grow flex flex-col gap-2">
        <div className="grow flex flex-col">
          {tab === "activity" ? <ActivityView /> : null}
          {tab === "sessions" ? <SessionsView /> : null}
          {tab === "tasks" ? <TasksView /> : null}
          {tab === "notes" ? <NotesView /> : null}
        </div>
        <div className="w-full h-8 flex flex-row gap-0.5 rounded overflow-clip text-sm">
          <Button
            size="fill"
            rounded={false}
            primary={tab === "activity"}
            onClick={() => setTab("activity")}
          >
            Activity
          </Button>
          <Button
            size="fill"
            rounded={false}
            primary={tab === "sessions"}
            onClick={() => setTab("sessions")}
          >
            Sessions
          </Button>
          <Button
            size="fill"
            rounded={false}
            primary={tab === "tasks"}
            onClick={() => setTab("tasks")}
          >
            Tasks
          </Button>
          <Button
            size="fill"
            rounded={false}
            primary={tab === "notes"}
            onClick={() => setTab("notes")}
          >
            Notes
          </Button>
        </div>
      </div>
    </div>
  );
};

const ActivityView: React.FC = () => {
  return (
    <div className="grow flex flex-col gap-2 p-2 bg-darker/10 rounded">
      Activity
    </div>
  );
};

const SessionsView: React.FC = () => {
  return (
    <div className="grow flex flex-col gap-2 p-2 bg-darker/10 rounded">
      Sessions
    </div>
  );
};

const TasksView: React.FC = () => {
  return (
    <div className="grow flex flex-col gap-2 p-2 bg-darker/10 rounded">
      Tasks
    </div>
  );
};

const NotesView: React.FC = () => {
  return (
    <div className="grow flex flex-col gap-2 p-2 bg-darker/10 rounded">
      Notes
    </div>
  );
};

export default IntentDetails;
