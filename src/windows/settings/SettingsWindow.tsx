import React from "react";
import { MdSettings } from "react-icons/md";

import { ipc_invoke } from "@/app/ipc";
import Layout from "@/components/Layout";
import { Settings } from "@/bindings/Settings";
import TimerSection from "./TimerSection";
import ThemeSection from "./themes";
import AlertSection from "./AlertSection";
import AboutSection from "./AboutSection";

const SettingsWindow: React.FC = () => {
  const [settings, setSettings] = React.useState<Settings>();

  React.useEffect(() => {
    ipc_invoke<Settings>("get_settings").then((res) => setSettings(res.data));
  }, []);

  return (
    <Layout label="Settings" icon={<MdSettings size={32} />}>
      <div className="flex flex-col gap-6 py-2 px-4 overflow-y-auto">
        {settings && (
          <>
            <TimerSection settings={settings} setSettings={setSettings} />
            <AlertSection settings={settings} setSettings={setSettings} />
            <ThemeSection />
            <AboutSection />
          </>
        )}
      </div>
    </Layout>
  );
};

export default SettingsWindow;
