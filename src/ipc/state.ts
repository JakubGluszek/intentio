import { invoke } from "@tauri-apps/api";

import { TimerSession } from "@/bindings/TimerSession";

export const getTimerSession = async () => {
  return await invoke<TimerSession>("get_timer_session");
};

export const setTimerSession = async (data: TimerSession) => {
  return await invoke<TimerSession>("set_timer_session", { data });
};
