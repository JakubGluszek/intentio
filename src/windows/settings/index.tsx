import React from "react";
import { MdSettings } from "react-icons/md";

import Layout from "@/components/Layout";
import TimerSection from "./TimerSection";
import ThemeSection from "./themes";
import AlertSection from "./AlertSection";
import AboutSection from "./AboutSection";
import { useStore } from "@/app/store";
import { updateSettings } from "@/app/services";
import { SettingsForUpdate } from "@/bindings/SettingsForUpdate";

const SettingsWindow: React.FC = () => {
  const settings = useStore((state) => state.settings);
  const setSettings = useStore((state) => state.setSettings);

  const update = async (data: Partial<SettingsForUpdate>) => {
    const result = await updateSettings(data);
    setSettings(result);
    return result;
  };

  return (
    <Layout label="Settings" icon={<MdSettings size={32} />}>
      {settings && (
        <div className="flex flex-col gap-6 py-2 px-4 overflow-y-auto">
          <TimerSection settings={settings} update={update} />
          <AlertSection settings={settings} update={update} />
          <ThemeSection />
          <AboutSection />
        </div>
      )}
    </Layout>
  );
};

export default SettingsWindow;
