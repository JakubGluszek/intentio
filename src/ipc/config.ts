import { invoke } from "@tauri-apps/api";

import { AudioConfig } from "@/bindings/AudioConfig";
import { AudioConfigForUpdate } from "@/bindings/AudioConfigForUpdate";
import { BehaviorConfig } from "@/bindings/BehaviorConfig";
import { BehaviorConfigForUpdate } from "@/bindings/BehaviorConfigForUpdate";
import { InterfaceConfig } from "@/bindings/InterfaceConfig";
import { InterfaceConfigForUpdate } from "@/bindings/InterfaceConfigForUpdate";
import { TimerConfig } from "@/bindings/TimerConfig";
import { TimerConfigForUpdate } from "@/bindings/TimerConfigForUpdate";

export const getTimerConfig = async () => {
  return await invoke<TimerConfig>("get_timer_config");
};

export const updateTimerConfig = async (
  data: Partial<TimerConfigForUpdate>
) => {
  return await invoke<TimerConfig>("update_timer_config", { data });
};

export const getAudioConfig = async () => {
  return await invoke<AudioConfig>("get_audio_config");
};

export const updateAudioConfig = async (
  data: Partial<AudioConfigForUpdate>
) => {
  return await invoke<AudioConfig>("update_audio_config", { data });
};

export const getBehaviorConfig = async () => {
  return await invoke<BehaviorConfig>("get_behavior_config");
};

export const updateBehaviorConfig = async (
  data: Partial<BehaviorConfigForUpdate>
) => {
  return await invoke<BehaviorConfig>("update_behavior_config", { data });
};

export const getInterfaceConfig = async () => {
  return await invoke<InterfaceConfig>("get_interface_config");
};

export const updateInterfaceConfig = async (
  data: Partial<InterfaceConfigForUpdate>
) => {
  return await invoke<InterfaceConfig>("update_interface_config", { data });
};
