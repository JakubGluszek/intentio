import { invoke } from "@tauri-apps/api";

import { Settings } from "@/bindings/Settings";
import { SettingsForUpdate } from "@/bindings/SettingsForUpdate";

export const getSettings = async () => {
  return await invoke<Settings>("get_settings");
};

export const updateSettings = async (data: Partial<SettingsForUpdate>) => {
  return await invoke<Settings>("update_settings", { data });
};
