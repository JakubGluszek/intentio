import ipc from "@/ipc";

import { QueueSession } from "@/bindings/QueueSession";

export const useTimer = () => {
  const play = async () => {
    return ipc.timerPlay();
  };

  const stop = async () => {
    return ipc.timerStop();
  };

  const restart = async () => {
    return ipc.timerRestart();
  };

  const skip = async () => {
    return ipc.timerSkip();
  };

  const setIntent = async (id: number) => {
    return ipc.timerSetIntent(id);
  };

  const addToQueue = async (data: QueueSession) => {
    return ipc.timerAddToQueue(data);
  };

  const removeFromQueue = async (idx: number) => {
    return ipc.timerRemoveFromQueue(idx);
  };

  const reorderQueue = async (idx: number, target_idx: number) => {
    return ipc.timerReorderQueue(idx, target_idx);
  };

  const clearQueue = async () => {
    return ipc.timerClearQueue();
  };

  const incrementQueueSessionIterations = async (idx: number) => {
    return ipc.timerIncrementQueueSessionIterations(idx);
  };

  const decrementQueueSessionIterations = async (idx: number) => {
    return ipc.timerDecrementQueueSessionIterations(idx);
  };

  const updateQueueSessionDuration = async (idx: number, duration: number) => {
    return ipc.timerUpdateQueueSessionDuration(idx, duration);
  };

  return {
    play,
    stop,
    restart,
    skip,
    setIntent,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    clearQueue,
    incrementQueueSessionIterations,
    decrementQueueSessionIterations,
    updateQueueSessionDuration,
  };
};
