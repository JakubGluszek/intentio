import React from "react";
import { MdSettings, MdAnalytics, MdRemove, MdClose } from "react-icons/md";
import { IoMdReorder } from "react-icons/io";
import { appWindow, WebviewWindow } from "@tauri-apps/api/window";

import Layout from "../../components/Layout";
import Timer from "./Timer";
import useGlobal from "../../store";

const MainWindow: React.FC = () => {
  const settings = useGlobal((state) => state.settings);
  const currentProject = useGlobal((state) => state.currentProject);
  const activeQueue = useGlobal((state) => state.activeQueue);
  const getTotalQueueCycles = useGlobal((state) => state.getTotalQueueCycles);

  return (
    <Layout>
      <div className="relative w-screen h-screen flex flex-col p-4">
        <div
          data-tauri-drag-region
          className="h-10 flex flex-row items-center justify-between"
        >
          <div className="flex flex-row items-center gap-2">
            <button
              className="btn btn-ghost"
              onClick={() =>
                new WebviewWindow("settings", {
                  url: "/settings",
                  decorations: false,
                  title: "Settings",
                  skipTaskbar: true,
                  width: 328,
                  height: 480,
                  resizable: false,
                  fullscreen: false,
                })
              }
            >
              <MdSettings size={32} />
            </button>
            <button className="btn btn-ghost">
              <MdAnalytics
                size={32}
                onClick={() =>
                  new WebviewWindow("analytics", {
                    url: "/analytics",
                    decorations: false,
                    title: "Analytics",
                    skipTaskbar: true,
                    width: 460,
                    height: 420,
                    resizable: false,
                    fullscreen: false,
                  })
                }
              />
            </button>
          </div>
          <div className="flex flex-row items-center gap-2">
            <button className="btn btn-ghost" onClick={() => appWindow.hide()}>
              <MdRemove size={32} />
            </button>
            <button className="btn btn-ghost" onClick={() => appWindow.close()}>
              <MdClose size={32} />
            </button>
          </div>
        </div>
        <div className="grow flex flex-col p-4">
          {settings && activeQueue !== undefined && (
            <Timer settings={settings} activeQueue={activeQueue} />
          )}
        </div>
        <div className="relative h-10 flex flex-row items-center justify-between">
          <button
            className="btn btn-ghost"
            onClick={() =>
              new WebviewWindow("queues", {
                url: "/queues",
                decorations: false,
                title: "Queues",
                skipTaskbar: true,
                width: 450,
                height: 380,
                resizable: false,
                fullscreen: false,
              })
            }
          >
            <IoMdReorder size={32} />
            {activeQueue && (
              <span>
                {activeQueue.iterations}/{getTotalQueueCycles()}
              </span>
            )}
          </button>
          <button
            className="absolute left-[50%] right-[50%] btn btn-ghost whitespace-nowrap"
            onClick={() =>
              new WebviewWindow("projects", {
                url: "/projects",
                decorations: false,
                title: "Projects",
                skipTaskbar: true,
                width: 280,
                height: 360,
                resizable: false,
                fullscreen: false,
              })
            }
          >
            {currentProject?.name ?? "None"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default MainWindow;
