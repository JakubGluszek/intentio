import React from "react";
import { invoke } from "@tauri-apps/api";
import { Settings, SettingsUpdate } from "../types";
import { emit } from "@tauri-apps/api/event";

const useSettings = () => {
  const [settings, setSettings] = React.useState<Settings>();

  React.useEffect(() => {
    readSettings();
  }, []);

  const readSettings = async () => {
    const settings = await invoke<Settings>("read_settings");
    setSettings(settings);
  };

  const update = async (changes: SettingsUpdate) => {
    const updated = await invoke<Settings>("update_settings", {
      settings: { ...settings, ...changes },
    });
    setSettings(updated);
    await emit("update_settings", updated);
  };

  return {
    settings,
    setSettings,
    update,
  };
};

export default useSettings;
