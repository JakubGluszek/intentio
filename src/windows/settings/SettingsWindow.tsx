import React from "react";
import { MdSettings } from "react-icons/md";

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
    <Layout Icon={MdSettings} label="Settings">
      <div className="w-screen min-h-screen flex flex-col gap-2">
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
