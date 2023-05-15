import { invoke } from "@tauri-apps/api";

import { SettingsConfig } from "@/bindings/SettingsConfig";
import { SettingsConfigForUpdate } from "@/bindings/SettingsConfigForUpdate";
import { TimerConfig } from "@/bindings/TimerConfig";
import { TimerConfigForUpdate } from "@/bindings/TimerConfigForUpdate";

export const getSettingsConfig = async () => {
  return await invoke<SettingsConfig>("get_settings_config");
};

export const updateSettingsConfig = async (
  data: Partial<SettingsConfigForUpdate>
) => {
  return await invoke<void>("update_settings_config", { data });
};

export const getTimerConfig = async () => {
  return await invoke<TimerConfig>("get_timer_config");
};

export const updateTimerConfig = async (
  data: Partial<TimerConfigForUpdate>
) => {
  return await invoke<void>("update_timer_config", { data });
};
