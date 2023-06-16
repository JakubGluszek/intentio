import { invoke } from "@tauri-apps/api";

import { QueueSession } from "@/bindings/QueueSession";

export const timerPlay = async () => {
  return await invoke<void>("timer_play", {});
};

export const timerStop = async () => {
  return await invoke<void>("timer_stop", {});
};

export const timerRestart = async () => {
  return await invoke<void>("timer_restart", {});
};

export const timerSkip = async () => {
  return await invoke<void>("timer_skip", {});
};

export const timerSetIntent = async (id: number) => {
  return await invoke<void>("timer_set_intent", { id });
};

export const timerAddToQueue = async (data: QueueSession) => {
  return await invoke<void>("timer_add_to_queue", { data });
};

export const timerRemoveFromQueue = async (idx: number) => {
  return await invoke<void>("timer_remove_from_queue", { idx });
};

export const timerReorderQueue = async (idx: number, targetIdx: number) => {
  return await invoke<void>("timer_reorder_queue", { idx, targetIdx });
};

export const timerClearQueue = async () => {
  return await invoke<void>("timer_clear_queue", {});
};

export const timerIncrementQueueSessionIterations = async (idx: number) => {
  return await invoke<void>("timer_increment_queue_session_iterations", {
    idx,
  });
};

export const timerDecrementQueueSessionIterations = async (idx: number) => {
  return await invoke<void>("timer_decrement_queue_session_iterations", {
    idx,
  });
};

export const timerUpdateQueueSessionDuration = async (
  idx: number,
  duration: number
) => {
  return await invoke<void>("timer_update_queue_session_duration", {
    idx,
    duration,
  });
};
