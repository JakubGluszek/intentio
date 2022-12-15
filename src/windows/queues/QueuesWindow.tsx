import React from "react";
import { MdAddCircle } from "react-icons/md";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { invoke } from "@tauri-apps/api/tauri";

import QueueView from "./QueueView";
import useGlobal from "../../app/store";
import CreateQueueView from "./CreateQueueView";
import { ipc_invoke } from "../../app/ipc";
import QueueIcon from "../../components/QueueIcon";
import { Project } from "../../bindings/Project";
import { Queue } from "../../bindings/Queue";
import { SessionQueue } from "../../bindings/SessionQueue";
import Button from "../../components/Button";
import Layout from "../../components/Layout";

const QueuesWindow: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);

  const queues = useGlobal((state) => state.queues);
  const sessionQueue = useGlobal((state) => state.sessionQueue);
  const setSessionQueue = useGlobal((state) => state.setSessionQueue);
  const setProjects = useGlobal((state) => state.setProjects);
  const setQueues = useGlobal((state) => state.setQueues);

  const [containerRef] = useAutoAnimate<HTMLDivElement>();

  React.useEffect(() => {
    ipc_invoke<Queue[]>("get_queues")
      .then((res) => setQueues(res.data))
      .catch((err) => console.log(err));
    ipc_invoke<Project[]>("get_projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.log(err));
    invoke<SessionQueue | undefined>("get_session_queue")
      .then((data) => setSessionQueue(data ? data : null))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Layout label="Queues" icon={<QueueIcon size={24} />}>
      <div className="flex flex-col gap-6 py-2">
        {/* Active queue */}
        {sessionQueue ? (
          <div className="flex flex-col gap-2 p-2 bg-base rounded">
            <div className="text-lg">
              Active:{" "}
              <span className="text-primary font-semibold">
                {sessionQueue.name}
              </span>
            </div>
            <Button onClick={() => ipc_invoke("remove_session_queue")}>
              Deactivate
            </Button>
          </div>
        ) : null}

        <div className="flex flex-col gap-4">
          {/* Create queue */}
          {!viewCreate ? (
            <Button onClick={() => setViewCreate(true)}>
              <MdAddCircle size={24} />
              <span>Create</span>
            </Button>
          ) : (
            <div className="flex flex-col">
              <CreateQueueView hide={() => setViewCreate(false)} />
            </div>
          )}

          {/* All queues */}
          <div ref={containerRef} className="flex flex-col gap-6">
            {queues.map((q) => (
              <QueueView key={q.id} data={q} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QueuesWindow;
