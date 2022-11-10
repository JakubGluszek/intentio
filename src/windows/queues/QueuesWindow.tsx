import React from "react";
import { MdAddCircle, MdClose, MdDelete } from "react-icons/md";
import { IoMdReorder } from "react-icons/io";
import { appWindow } from "@tauri-apps/api/window";
import cuid from "cuid";
import { Slider, Select } from "@mantine/core";

import Layout from "../../components/Layout";
import QueueView from "./QueueView";
import useGlobal from "../../store";
import { QueueSession } from "../../bindings/QueueSession";

const QueuesWindow: React.FC = () => {
  const queues = useGlobal((state) => state.queues);
  const [viewCreate, setViewCreate] = React.useState(false);

  return (
    <Layout>
      <div className="w-screen min-h-screen flex flex-col">
        {/* Window Header */}
        <div className="z-[9999] sticky top-0 flex flex-col gap-2 bg-window px-4 py-2">
          <div
            data-tauri-drag-region
            className="flex flex-row items-center justify-between"
          >
            <div className="flex flex-row items-center gap-2">
              <IoMdReorder size={32} />
              <span>Queues</span>
            </div>
            <button className="btn btn-ghost" onClick={() => appWindow.close()}>
              <MdClose size={32} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-4 py-2">
          {/* Active queue */}
          <div className="flex flex-col">
            <div className=""></div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Create queue */}
            {!viewCreate ? (
              <button
                className="btn btn-primary w-fit"
                onMouseUp={() => setViewCreate(true)}
              >
                <MdAddCircle size={24} />
                <span>Add a queue</span>
              </button>
            ) : (
              <CreateQueueView hide={() => setViewCreate(false)} />
            )}

            {/* All queues */}
            <div className="flex flex-col">
              {queues.map((q) => (
                <QueueView key={q.id} data={q} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface CreateQueueViewProps {
  hide: () => void;
}

const CreateQueueView: React.FC<CreateQueueViewProps> = ({ hide }) => {
  const [sessions, setSessions] = React.useState<QueueSession[]>([]);
  const [name, setName] = React.useState("");

  const [createSessionView, setCreateSessionView] = React.useState(false);

  const createRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const save = () => {
    if (name.length === 0) {
      inputRef.current?.focus();
      window.scrollTo({ top: 0 });
      return;
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-base rounded p-4">
      {/* Queue name input */}
      <div className="flex flex-row items-center gap-4">
        <label htmlFor="queue-name">Name</label>
        <input
          ref={inputRef}
          autoFocus
          id="queue-name"
          className="input border-window"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          type="text"
          minLength={1}
          maxLength={24}
        />
      </div>

      {/* Sessions */}
      <div className="flex flex-col gap-4">
        {!createSessionView ? (
          <button
            className="btn btn-primary w-fit"
            onMouseUp={() => setCreateSessionView(true)}
          >
            <MdAddCircle size={24} />
            <span className="text-sm">Add Session</span>
          </button>
        ) : (
          <CreateSessionView
            hide={() => setCreateSessionView(false)}
            addSession={(session: QueueSession) =>
              setSessions((sessions) => [...sessions, session])
            }
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
        <button className="btn btn-ghost" onMouseUp={() => hide()}>
          Cancel
        </button>
        <button
          ref={createRef}
          className="btn btn-primary"
          onMouseUp={() => save()}
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
      <button className="absolute top-0.5 right-2 transition-opacity opacity-0 group-hover:opacity-100 btn btn-ghost">
        <MdDelete size={24} />
      </button>
    </div>
  );
};

interface CreateSessionViewProps {
  hide: () => void;
  addSession: (session: QueueSession) => void;
}

const CreateSessionView: React.FC<CreateSessionViewProps> = ({
  hide,
  addSession,
}) => {
  const [duration, setDuration] = React.useState(25);
  const [cycles, setCycles] = React.useState(1);
  const [projectId, setProjectId] = React.useState<string | null>(null);

  const projects = useGlobal((state) => state.projects);

  const save = () => {
    addSession({ id: cuid(), duration, cycles, project_id: projectId });
    hide();
  };

  return (
    <div className="w-full flex flex-col gap-2 bg-window rounded p-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-4">
            <label className="min-w-[80px]" htmlFor="session-duration">
              Duration
            </label>
            <Slider
              classNames={{
                root: "w-full",
                bar: "bg-primary",
                thumb: "bg-primary border-primary",
                track: "before:bg-window",
                label: "bg-base text-text",
              }}
              min={1}
              max={90}
              defaultValue={duration}
              onChangeEnd={(minutes) => setDuration(minutes)}
            />
          </div>
          <div className="flex flex-row items-center gap-4">
            <label className="min-w-[80px]" htmlFor="session-project">
              Project
            </label>
            {/* value, label */}
            <Select
              id="session-project"
              value={projectId}
              onChange={setProjectId}
              classNames={{
                input:
                  "bg-window border-2 border-base focus:border-primary text-text focus:text-primary",
                dropdown:
                  "bg-window border-2 border-primary flex flex-col gap-2",
                item: "bg-window text-text",
                itemsWrapper: "flex flex-col gap-1",
              }}
              styles={{
                item: {
                  "&[data-selected]": {
                    "&, &:hover": {
                      backgroundColor: "var(--primary-color)",
                      color: "var(--window-color)",
                    },
                  },
                  "&[data-hovered]": {
                    backgroundColor: "var(--base-color)",
                    color: "var(--text-color)",
                  },
                },
              }}
              data={projects.map((p) => ({ value: p.id, label: p.name }))}
              clearable
            />
          </div>
          <div className="flex flex-row items-center gap-4">
            <label className="min-w-[80px]" htmlFor="session-cycles">
              Cycles
            </label>
            <Slider
              classNames={{
                root: "w-full",
                bar: "bg-primary",
                thumb: "bg-primary border-primary",
                track: "before:bg-window",
                label: "bg-base text-text",
              }}
              min={1}
              max={16}
              defaultValue={cycles}
              onChangeEnd={(cycles) => setCycles(cycles)}
            />
          </div>
        </div>
        {/* Controls */}
        <div className="flex flex-row items-center justify-between">
          <button className="btn btn-ghost" onMouseUp={() => hide()}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            onMouseUp={() => save()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueuesWindow;
