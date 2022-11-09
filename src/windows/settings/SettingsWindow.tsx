import React from "react";
import { appWindow } from "@tauri-apps/api/window";
import { MdClose, MdSettings } from "react-icons/md";

import TimerSection from "./TimerSection";
import ThemeSection from "./ThemeSection";
import AlertSection from "./AlertSection";
import AboutSection from "./AboutSection";
import Layout from "../../components/Layout";
import { Settings } from "../../bindings/Settings";
import { ipc_invoke } from "../../ipc";

const SettingsWindow: React.FC = () => {
  const [settings, setSettings] = React.useState<Settings>();

  React.useEffect(() => {
    ipc_invoke<Settings>("get_settings").then((res) => setSettings(res.data));
  }, []);

  return (
    <Layout>
      <div className="w-screen min-h-screen flex flex-col gap-2">
        {/* Window Header */}
        <div className="z-[9999] sticky top-0 flex flex-col gap-2 bg-window px-4 py-2">
          <div
            data-tauri-drag-region
            className="flex flex-row items-center justify-between"
          >
            <div className="flex flex-row items-center gap-2">
              <MdSettings size={32} />
              <span>Settings</span>
            </div>
            <button className="btn btn-ghost" onClick={() => appWindow.close()}>
              <MdClose size={32} />
            </button>
          </div>
        </div>
        {/* Main */}
        <div className="flex flex-col gap-6 px-4 py-2">
          {settings && (
            <>
              <TimerSection settings={settings} setSettings={setSettings} />
              <AlertSection settings={settings} setSettings={setSettings} />
              <ThemeSection />
              <AboutSection />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SettingsWindow;
