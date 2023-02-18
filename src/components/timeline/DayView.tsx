import React from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

import { DayDetail } from "@/types";
import { Button } from "@/components";
import SessionsView from "./SessionsView";
import TasksView from "./TasksView";
import NotesView from "./NotesView";

interface Props {
  intentId?: string;
  data: DayDetail;
  collapse: boolean;
  displaySessionLabel?: boolean;
}

const DayView: React.FC<Props> = (props) => {
  const { data } = props;

  const [viewMore, setViewMore] = React.useState(false);
  const [tab, setTab] = React.useState<"sessions" | "tasks" | "notes">(
    "sessions"
  );

  React.useEffect(() => {
    setViewMore(props.collapse);
  }, [props.collapse]);

  return (
    <div
      data-tauri-disable-drag
      className="flex flex-col p-1.5 gap-1 rounded shadow bg-window/80 hover:bg-window"
    >
      <div className="h-6 w-full flex flex-row items-center justify-between">
        <span className="text-text/80">{data.date}</span>
        <Button transparent onClick={() => setViewMore((v) => !v)}>
          {viewMore ? (
            <MdKeyboardArrowUp size={28} />
          ) : (
            <MdKeyboardArrowDown size={28} />
          )}
        </Button>
      </div>
      {viewMore ? (
        <div className="flex flex-col bg-window/80 rounded overflow-clip">
          <div className="h-6 flex flex-row gap-0.5 text-sm">
            <Button
              style={{
                width: tab === "sessions" ? "100%" : "fit-content",
              }}
              isSelected={tab === "sessions"}
              rounded={false}
              onClick={() => setTab("sessions")}
            >
              Sessions
            </Button>
            <Button
              style={{
                width: tab === "tasks" ? "100%" : "fit-content",
              }}
              isSelected={tab === "tasks"}
              rounded={false}
              onClick={() => setTab("tasks")}
            >
              Tasks
            </Button>
            <Button
              style={{
                width: tab === "notes" ? "100%" : "fit-content",
              }}
              isSelected={tab === "notes"}
              rounded={false}
              onClick={() => setTab("notes")}
            >
              Notes
            </Button>
          </div>
          <div className="flex flex-col bg-darker/20">
            {tab === "sessions" ? (
              <SessionsView sessions={props.data.sessions} displayLabel={props.displaySessionLabel} />
            ) : null}
            {tab === "tasks" ? (
              <TasksView intentId={props.intentId} date={props.data.date} />
            ) : null}
            {tab === "notes" ? (
              <NotesView intentId={props.intentId} date={props.data.date} />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DayView;
