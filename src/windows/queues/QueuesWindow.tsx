import React from "react";
import { MdAddCircle, MdClose } from "react-icons/md";
import { IoMdReorder } from "react-icons/io";
import { appWindow } from "@tauri-apps/api/window";

import Layout from "../../components/Layout";
import QueueView from "./QueueView";
import useGlobal from "../../store";
import CreateQueueView from "./CreateQueueView";
import { ipc_invoke } from "../../ipc";

const QueuesWindow: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);

  const queues = useGlobal((state) => state.queues);
  const activeQueue = useGlobal((state) => state.activeQueue);

  return (
    <Layout>
      <div className="w-screen min-h-screen flex flex-col">
        {/* Window Header */}
        <div className="z-[20] sticky top-0 flex flex-col gap-2 bg-window px-4 py-2">
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
          {activeQueue && (
            <div className="flex flex-col">
              <div className="">Active: {activeQueue.name}</div>
              <button
                className="btn btn-primary"
                onClick={() => ipc_invoke("deactivate_queue")}
              >
                Deactivate
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {/* Create queue */}
            {!viewCreate ? (
              <button
                className="btn btn-primary w-fit"
                onClick={() => setViewCreate(true)}
              >
                <MdAddCircle size={24} />
                <span>Add a queue</span>
              </button>
            ) : (
              <CreateQueueView hide={() => setViewCreate(false)} />
            )}

            {/* All queues */}
            <div className="flex flex-col gap-6">
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

export default QueuesWindow;
