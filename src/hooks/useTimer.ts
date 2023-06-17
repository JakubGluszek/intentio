import React from "react";

import ipc from "@/ipc";
import { QueueSession } from "@/bindings/QueueSession";
import { TimerSession } from "@/bindings/TimerSession";
import { Intent } from "@/bindings/Intent";
import useEvents from "./useEvents";

export const useTimer = () => {
  const [session, setSession] = React.useState<TimerSession>();

  React.useEffect(() => {
    ipc.timerGetSession().then((data) => setSession(data));
  }, []);

  useEvents({
    timer_session_updated: (data) => {
      console.log(JSON.stringify(data));
      setSession(data);
    },
  });

  const setIntent = async (intent: Intent) => {
    ipc.timerSetSessionIntent(intent);
  };

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
    session,
    setIntent,
    play,
    stop,
    restart,
    skip,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    clearQueue,
    incrementQueueSessionIterations,
    decrementQueueSessionIterations,
    updateQueueSessionDuration,
  };
};
