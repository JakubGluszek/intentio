import { invoke } from "@tauri-apps/api";

import { TimerStateForUpdate } from "@/bindings/TimerStateForUpdate";

export const updateTimerState = async (data: Partial<TimerStateForUpdate>) => {
  return await invoke("update_timer_state", { data });
};
