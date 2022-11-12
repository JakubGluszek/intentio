import React from "react";
import cuid from "cuid";
import { MdAddCircle, MdDelete } from "react-icons/md";

import { Queue } from "../../bindings/Queue";
import { QueueSession } from "../../bindings/QueueSession";
import { ipc_invoke } from "../../ipc";
import useGlobal from "../../store";
import CreateSessionView from "./CreateSessionView";

interface Props {
  hide: () => void;
}

const CreateQueueView: React.FC<Props> = ({ hide }) => {
  const [sessions, setSessions] = React.useState<QueueSession[]>([]);
  const [name, setName] = React.useState("");

  const [createSessionView, setCreateSessionView] = React.useState(false);

  const createRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const addSessionRef = React.useRef<HTMLButtonElement | null>(null);

  const addQueue = useGlobal((state) => state.addQueue);

  /** Creates a queue */
  const save = () => {
    if (name.length === 0) {
      inputRef.current?.focus();
      window.scrollTo({ top: 0 });
      return;
    }

    ipc_invoke<Queue>("create_queue", { data: { name, sessions } })
      .then((res) => {
        addQueue(res.data);
        hide();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-col gap-6 bg-base rounded p-4">
      {/* Queue name input */}
      <div className="flex flex-row items-center gap-4">
        <input
          ref={inputRef}
          autoFocus
          placeholder="Name"
          className="input border-window"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          onKeyDown={(e) => {
            // necessary, entire window crashed otherwise
            // custom "focus next button" implementation produces the same issue
            if (e.key === "Tab") {
              e.preventDefault();
            }
          }}
          type="text"
          minLength={1}
          maxLength={24}
        />
      </div>

      {/* Sessions */}
      <div
        className={`flex flex-col ${sessions.length === 0 ? "gap-0" : "gap-4"}`}
      >
        {!createSessionView ? (
          <button
            ref={addSessionRef}
            className="btn btn-primary w-fit"
            onClick={() => setCreateSessionView(true)}
          >
            <MdAddCircle size={24} />
            <span className="text-sm">Add a Session</span>
          </button>
        ) : (
          <CreateSessionView
            hide={() => setCreateSessionView(false)}
            save={(session: QueueSession) => {
              setSessions((sessions) => [...sessions, session]);
              setCreateSessionView(false);
            }}
          />
        )}
        <div className="flex flex-col gap-2">
          {sessions.map((session) => (
            <QueueSessionView
              key={cuid()}
              data={session}
              removeSession={() =>
                setSessions((sessions) =>
                  sessions.filter((s) => s.id !== session.id)
                )
              }
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-row items-center justify-between">
        <button className="btn btn-ghost" onClick={() => hide()}>
          Cancel
        </button>
        <button
          ref={createRef}
          className="btn btn-primary"
          onClick={() => save()}
        >
          Create
        </button>
      </div>
    </div>
  );
};

interface QueueSessionViewProps {
  data: QueueSession;
  removeSession: () => void;
}

const QueueSessionView: React.FC<QueueSessionViewProps> = ({
  data,
  removeSession,
}) => {
  const getProjectById = useGlobal((state) => state.getProjectById);

  return (
    <div className="relative group flex flex-row gap-2 text-center rounded bg-window p-2">
      <div className="flex-1 items-center justify-center">
        {getProjectById(data.project_id)?.name ?? "None"}
      </div>
      <div className="flex-1 items-center justify-center">
        {data.duration} min
      </div>
      <div className="flex-1 items-center justify-center">{data.cycles}x</div>
      <button
        className="absolute top-0.5 right-2 transition-opacity opacity-0 group-hover:opacity-100 btn btn-ghost"
        onClick={() => removeSession()}
      >
        <MdDelete size={24} />
      </button>
    </div>
  );
};

export default CreateQueueView;
