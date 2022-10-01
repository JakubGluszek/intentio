import React from "react";
import { invoke } from "@tauri-apps/api";
import { Settings } from "../types";
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

  const update = React.useCallback((updated: Settings) => {
    invoke<Settings>("update_settings", {
      settings: updated,
    });
    setSettings(updated);
    emit("settings_updated", updated);
  }, []);

  return {
    settings,
    setSettings,
    update,
  };
};

export default useSettings;
