import React from "react";
import { MdSettings, MdAnalytics, MdRemove, MdClose } from "react-icons/md";
import { appWindow, WebviewWindow } from "@tauri-apps/api/window";

import Timer from "./Timer";
import useGlobal from "@/app/store";
import QueueIcon from "../../components/QueueIcon";
import { ipc_invoke } from "../../app/ipc";
import { ActiveQueue } from "../../bindings/ActiveQueue";
import { WebviewConfig } from "../../app/config";
import Button from "../../components/Button";

const MainWindow: React.FC = () => {
  const settings = useGlobal((state) => state.settings);
  const currentProject = useGlobal((state) => state.currentProject);
  const activeQueue = useGlobal((state) => state.activeQueue);
  const setActiveQueue = useGlobal((state) => state.setActiveQueue);
  const getTotalQueueCycles = useGlobal((state) => state.getTotalQueueCycles);

  React.useEffect(() => {
    ipc_invoke<ActiveQueue | undefined>("get_active_queue").then((res) =>
      setActiveQueue(res.data ? res.data : null)
    );
  }, []);

  return (
    <div className="relative w-screen h-screen flex flex-col p-4">
      <div
        data-tauri-drag-region
        className="h-10 flex flex-row items-center justify-between"
      >
        <div className="flex flex-row items-center gap-2">
          <Button
            transparent
            onClick={() =>
              new WebviewWindow("settings", {
                url: "/settings",
                title: "Settings",
                width: 328,
                height: 480,
                ...WebviewConfig,
              })
            }
          >
            <MdSettings size={32} />
          </Button>
          <Button
            transparent
            onClick={() =>
              new WebviewWindow("analytics", {
                url: "/analytics",
                title: "Analytics",
                width: 460,
                height: 420,
                ...WebviewConfig,
              })
            }
          >
            <MdAnalytics size={32} />
          </Button>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Button transparent onClick={() => appWindow.minimize()}>
            <MdRemove size={32} />
          </Button>
          <Button transparent onClick={() => appWindow.close()}>
            <MdClose size={32} />
          </Button>
        </div>
      </div>
      <div className="grow flex flex-col p-4">
        {settings && activeQueue !== undefined && (
          <Timer settings={settings} activeQueue={activeQueue} />
        )}
      </div>
      <div className="relative h-10 flex flex-row items-center justify-between">
        <Button
          transparent
          onClick={() =>
            new WebviewWindow("queues", {
              url: "/queues",
              title: "Queues",
              width: 450,
              height: 380,
              ...WebviewConfig,
            })
          }
        >
          <div className="w-8 h-fit">
            <QueueIcon />
          </div>
          {activeQueue && (
            <span>
              {activeQueue.iterations}/{getTotalQueueCycles()}
            </span>
          )}
        </Button>
        <Button
          style={{
            position: "absolute",
            left: "50%",
            right: "50%",
            whiteSpace: "nowrap",
          }}
          transparent
          onClick={() =>
            new WebviewWindow("projects", {
              url: "/projects",
              title: "Projects",
              width: 280,
              height: 360,
              ...WebviewConfig,
            })
          }
        >
          {currentProject?.name ?? "-"}
        </Button>
      </div>
    </div>
  );
};

export default MainWindow;
