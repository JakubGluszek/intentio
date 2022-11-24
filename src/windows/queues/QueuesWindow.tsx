import React from "react";
import { MdAddCircle } from "react-icons/md";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import QueueView from "./QueueView";
import useGlobal from "../../app/store";
import CreateQueueView from "./CreateQueueView";
import { ipc_invoke } from "../../app/ipc";
import QueueIcon from "../../components/QueueIcon";
import { Project } from "../../bindings/Project";
import { Queue } from "../../bindings/Queue";
import { ActiveQueue } from "../../bindings/ActiveQueue";
import Button from "../../components/Button";
import Layout from "../../components/Layout";

const QueuesWindow: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);

  const queues = useGlobal((state) => state.queues);
  const activeQueue = useGlobal((state) => state.activeQueue);
  const setActiveQueue = useGlobal((state) => state.setActiveQueue);
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
    ipc_invoke<ActiveQueue | undefined>("get_active_queue")
      .then((res) => setActiveQueue(res.data ? res.data : null))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Layout
      Icon={
        <div className="w-8 h-fit">
          <QueueIcon />
        </div>
      }
      label="Queues"
    >
      <div className="flex flex-col gap-6 py-2">
        {/* Active queue */}
        {activeQueue && (
          <div className="flex flex-col gap-2 p-2 bg-base rounded">
            <div className="text-lg">
              Active:{" "}
              <span className="text-primary font-semibold">
                {activeQueue.name}
              </span>
            </div>
            <Button onClick={() => ipc_invoke("deactivate_queue")}>
              Deactivate
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Create queue */}
          {!viewCreate ? (
            <Button onClick={() => setViewCreate(true)}>
              <MdAddCircle size={24} />
              <span>Create</span>
            </Button>
          ) : (
            <CreateQueueView hide={() => setViewCreate(false)} />
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
