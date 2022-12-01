import React from "react";
import { MdSettings, MdAnalytics, MdRemove, MdClose } from "react-icons/md";
import { appWindow, WebviewWindow } from "@tauri-apps/api/window";

import useGlobal from "@/app/store";
import Layout from "@/components/Layout";
import QueueIcon from "@/components/QueueIcon";
import Button from "@/components/Button";
import { SessionQueue } from "@/bindings/SessionQueue";
import { WebviewConfig } from "@/app/config";
import Timer from "./timer";
import { invoke } from "@tauri-apps/api/tauri";

const MainWindow: React.FC = () => {
  const settings = useGlobal((state) => state.settings);
  const currentProject = useGlobal((state) => state.currentProject);
  const sessionQueue = useGlobal((state) => state.sessionQueue);
  const setSessionQueue = useGlobal((state) => state.setSessionQueue);
  const getTotalQueueCycles = useGlobal((state) => state.getTotalQueueCycles);

  React.useEffect(() => {
    invoke<SessionQueue | undefined>("get_session_queue").then((data) =>
      setSessionQueue(data ? data : null)
    );
  }, []);

  const Header = (
    <div
      className="w-full flex flex-row items-center justify-between"
      data-tauri-drag-region
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
        <Button transparent onClick={() => appWindow.hide()}>
          <MdRemove size={32} />
        </Button>
        <Button transparent onClick={() => appWindow.close()}>
          <MdClose size={32} />
        </Button>
      </div>
    </div>
  );

  return (
    <Layout headerContent={Header}>
      <div className="grow flex flex-col p-4">
        {settings && sessionQueue !== undefined && (
          <Timer settings={settings} sessionQueue={sessionQueue} />
        )}
      </div>
      <div className="relative h-10 flex flex-row items-center justify-between pb-4">
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
          {sessionQueue && (
            <span>
              {sessionQueue.iterations}/{getTotalQueueCycles()}
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
    </Layout>
  );
};

export default MainWindow;
