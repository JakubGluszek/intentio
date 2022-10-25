import React from "react";
import {
  MdSettings,
  MdAnalytics,
  MdRemove,
  MdClose,
  MdCheckBox,
  MdStickyNote2,
} from "react-icons/md";
import { appWindow, WebviewWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";

import { Settings } from "../../bindings/Settings";
import { ipc_invoke } from "../../ipc";
import Layout from "../../components/Layout";
import Timer from "./Timer";

const MainWindow: React.FC = () => {
  const [settings, setSettings] = React.useState<Settings>();

  React.useEffect(() => {
    ipc_invoke<Settings>("get_settings").then((res) => setSettings(res.data));

    const unlisten = listen<string>("sync_settings", (event) => {
      setSettings(JSON.parse(event.payload));
    });

    return () => unlisten.then((f) => f()) as never;
  }, []);

  return (
    <Layout>
      <div className="relative w-screen h-screen flex flex-col p-4">
        <div className="h-10 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <button
              className="btn btn-ghost"
              onClick={() =>
                new WebviewWindow("settings", {
                  url: "/settings",
                  decorations: false,
                  alwaysOnTop: true,
                  title: "settings",
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
              <MdAnalytics size={32} />
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
        <div className="h-10 flex flex-row items-center justify-between">
          <button className="btn btn-ghost">
            <MdCheckBox size={32} />
          </button>
          <button
            className="btn btn-ghost"
            onClick={() =>
              new WebviewWindow("projects", {
                url: "/projects",
                decorations: false,
                alwaysOnTop: true,
                title: "Projects",
                skipTaskbar: true,
                width: 280,
                height: 360,
                resizable: false,
                fullscreen: false,
              })
            }
          >
            coding
          </button>
          <button className="btn btn-ghost">
            <MdStickyNote2 size={32} />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default MainWindow;
