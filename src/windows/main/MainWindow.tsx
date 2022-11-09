import React from "react";
import { MdSettings, MdAnalytics, MdRemove, MdClose } from "react-icons/md";
import { appWindow, WebviewWindow } from "@tauri-apps/api/window";

import Layout from "../../components/Layout";
import Timer from "./Timer";
import useGlobal from "../../store";

const MainWindow: React.FC = () => {
  const settings = useGlobal((state) => state.settings);
  const currentProject = useGlobal((state) => state.currentProject);

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
          {settings && <Timer settings={settings} />}
        </div>
        <div className="h-10 flex flex-row items-center justify-center">
          <button
            className="btn btn-ghost"
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
            {currentProject?.name ?? "-SELECT A PROJECT-"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default MainWindow;
