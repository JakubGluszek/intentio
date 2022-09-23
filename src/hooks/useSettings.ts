import React from "react";
import { invoke } from "@tauri-apps/api";
import { Settings } from "../types";

const useSettings = () => {
  const [settings, setSettings] = React.useState<Settings>();

  React.useEffect(() => {
    readSettings();
  }, []);

  const readSettings = async () => {
    const settings = await invoke<Settings>("read_settings");
    setSettings(settings);
  };

  return {
    settings,
  };
};

export default useSettings;
