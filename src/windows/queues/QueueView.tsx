import React from "react";
import { MdAddCircle, MdDelete, MdPlayCircle } from "react-icons/md";
import cuid from "cuid";

import { Queue } from "../../bindings/Queue";
import { QueueSession } from "../../bindings/QueueSession";

interface Props {
  data: Queue;
}

const QueueView: React.FC<Props> = ({ data }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <span>Name</span>
        <div className="flex flex-row items-center gap-2">
          <button className="btn btn-ghost">
            <MdPlayCircle size={24} />
          </button>
          <button className="btn btn-ghost">
            <MdDelete size={24} />
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center rounded bg-base p-1">
        <button className="btn btn-ghost mx-3">
          <MdAddCircle size={32} />
        </button>
        {/* Sessions */}
        <div className="flex flex-row gap-2">
          {data.sessions.map((s) => (
            <SessionView key={cuid()} data={s} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface SessionViewProps {
  data: QueueSession;
}

const SessionView: React.FC<SessionViewProps> = ({ data }) => {
  return <div className=""></div>;
};

export default QueueView;
