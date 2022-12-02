import React from "react";
import cuid from "cuid";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { MdAddCircle, MdDelete } from "react-icons/md";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { Queue } from "../../bindings/Queue";
import { QueueSession } from "../../bindings/QueueSession";
import { ipc_invoke } from "../../app/ipc";
import useGlobal from "../../app/store";
import CreateSessionView from "./CreateSessionView";
import Button from "../../components/Button";

interface Props {
  hide: () => void;
}

const CreateQueueView: React.FC<Props> = ({ hide }) => {
  const [sessions, setSessions] = React.useState<QueueSession[]>([]);

  const [createSessionView, setCreateSessionView] = React.useState(false);

  const createRef = React.useRef<HTMLButtonElement | null>(null);
  const addSessionRef = React.useRef<HTMLButtonElement | null>(null);
  const [containerRef] = useAutoAnimate<HTMLDivElement>();

  const addQueue = useGlobal((state) => state.addQueue);

  const { register, handleSubmit } = useForm<{ name: string }>();

  const onSubmit = handleSubmit((data) => {
    ipc_invoke<Queue>("create_queue", { data: { ...data, sessions } })
      .then((res) => {
        addQueue(res.data);
        hide();
        toast("Queue created");
      })
      .catch((err) => console.log(err));
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-6 bg-base rounded p-4 animate-in fade-in zoom-in-90"
    >
      {/* Queue name input */}
      <div className="flex flex-row items-center gap-4">
        <input
          autoFocus
          {...register("name", {
            required: true,
            minLength: 1,
            maxLength: 32,
          })}
          placeholder="Name"
          className="input border-window"
        />
      </div>

      {/* Sessions */}
      <div
        ref={containerRef}
        className={`flex flex-col ${sessions.length === 0 ? "gap-0" : "gap-4"}`}
      >
        {!createSessionView ? (
          <Button
            innerRef={addSessionRef}
            onClick={() => setCreateSessionView(true)}
          >
            <MdAddCircle size={24} />
            <span className="text-sm">Add session</span>
          </Button>
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
        <Button type="button" transparent onClick={() => hide()}>
          Cancel
        </Button>
        <Button type="submit" innerRef={createRef}>
          Create
        </Button>
      </div>
    </form>
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
      <div className="absolute top-0.5 right-2 transition-opacity opacity-0 group-hover:opacity-100">
        <Button transparent onClick={() => removeSession()}>
          <MdDelete size={24} />
        </Button>
      </div>
    </div>
  );
};

export default CreateQueueView;
