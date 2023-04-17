import React from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

import { DayDetail } from "@/types";
import SessionsView from "./SessionsView";
import TasksView from "./TasksView";
import NotesView from "./NotesView";
import { Button } from "@/ui";

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
      className="flex flex-col gap-2 card border-base/40"
    >
      <div className="h-5 w-full flex flex-row items-center justify-between">
        <span className="text-text/60">{data.date}</span>
        <Button variant="ghost" onClick={() => setViewMore((v) => !v)}>
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
              onClick={() => setTab("sessions")}
              variant="base"
              style={{
                width: tab === "sessions" ? "100%" : "fit-content",
              }}
            >
              Sessions
            </Button>
            <Button
              onClick={() => setTab("tasks")}
              variant="base"
              style={{
                width: tab === "tasks" ? "100%" : "fit-content",
              }}
            >
              Tasks
            </Button>
            <Button
              onClick={() => setTab("notes")}
              variant="base"
              style={{
                width: tab === "notes" ? "100%" : "fit-content",
              }}
            >
              Notes
            </Button>
          </div>
          <div className="flex flex-col bg-darker/30 shadow-inner shadow-black/60">
            {tab === "sessions" ? (
              <SessionsView
                sessions={props.data.sessions}
                displayLabel={props.displaySessionLabel}
              />
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
