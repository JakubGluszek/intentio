import React from "react";

import { Session } from "@/bindings/Session";

interface Props {
  sessions?: Session[];
}

const SessionsView: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col gap-1">
      {props.sessions
        ? props.sessions.map((session) => (
          <SessionView key={session.id} data={session} />
        ))
        : null}
    </div>
  );
};

interface SessionViewProps {
  data: Session;
}

const SessionView: React.FC<SessionViewProps> = (props) => {
  const { data } = props;

  const startedAt = new Date(parseInt(data.started_at))
    .toLocaleString()
    .split(",")[1];

  const finishedAt = new Date(parseInt(data.finished_at))
    .toLocaleString()
    .split(",")[1];

  return (
    <div className="flex flex-row items-center justify-between p-0.5 px-2 bg-window rounded shadow text-sm">
      <div>{data.duration} min</div>
      <div>
        {startedAt} - {finishedAt}
      </div>
    </div>
  );
};

export default SessionsView;
