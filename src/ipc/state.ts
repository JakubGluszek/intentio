import { invoke } from "@tauri-apps/api";

import { TimerStateForUpdate } from "@/bindings/TimerStateForUpdate";
import { Theme } from "@/bindings/Theme";

export const updateTimerState = async (data: Partial<TimerStateForUpdate>) => {
  return await invoke<void>("update_timer_state", { data });
};

export const setCurrentTheme = async (data: Theme) => {
  return await invoke<void>("set_current_theme", { data });
};

export const setIdleTheme = async (data: Theme) => {
  return await invoke<void>("set_idle_theme", { data });
};

export const setFocusTheme = async (data: Theme) => {
  return await invoke<void>("set_focus_theme", { data });
};

export const setBreakTheme = async (data: Theme) => {
  return await invoke<void>("set_break_theme", { data });
};

export const setLongBreakTheme = async (data: Theme) => {
  return await invoke<void>("set_long_break_theme", { data });
};
