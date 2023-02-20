import React from "react";
import { Tooltip } from "@mantine/core";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import useStore from "@/store";
import { Session } from "@/bindings/Session";

interface Props {
  sessions?: Session[];
  displayLabel?: boolean;
}

const SessionsView: React.FC<Props> = (props) => {
  const [ref] = useAutoAnimate<HTMLDivElement>();

  return (
    <div ref={ref} className="flex flex-col gap-1 p-1.5">
      {props.sessions!.map((session) => (
        <SessionView
          key={session.id}
          data={session}
          displayLabel={props.displayLabel}
        />
      ))}
    </div>
  );
};

interface SessionViewProps {
  data: Session;
  displayLabel?: boolean;
}

const SessionView: React.FC<SessionViewProps> = (props) => {
  const { data } = props;

  const store = useStore();

  const startedAt = new Date(parseInt(data.started_at))
    .toLocaleString()
    .split(",")[1];

  const finishedAt = new Date(parseInt(data.finished_at))
    .toLocaleString()
    .split(",")[1];

  return (
    <Tooltip openDelay={400} label={`${startedAt} - ${finishedAt}`}>
      <div className="flex flex-row items-center justify-between px-2 text-sm card rounded-sm">
        <div className="text-text/80">{data.duration} min</div>
        {props.displayLabel ? (
          <div>
            {store.getIntentById(props.data.intent_id)?.label ?? "undefined"}
          </div>
        ) : null}
      </div>
    </Tooltip>
  );
};

export default SessionsView;
