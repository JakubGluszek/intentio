import React from "react";

import ipc from "@/ipc";
import { QueueSession } from "@/bindings/QueueSession";
import { TimerSession } from "@/bindings/TimerSession";
import { Intent } from "@/bindings/Intent";
import { Queue } from "@/bindings/Queue";

import useEvents from "./useEvents";
import { TimerConfig } from "@/bindings/TimerConfig";

export const useTimer = () => {
  const [session, setSession] = React.useState<TimerSession | null>();
  const [queue, setQueue] = React.useState<Queue | null>();
  const [config, setConfig] = React.useState<TimerConfig | null>();

  React.useEffect(() => {
    ipc
      .timerGetSession()
      .then((data) => {
        setSession(data);
      })
      .catch(() => {
        setSession(null);
      });

    ipc
      .timerGetQueue()
      .then((data) => setQueue(data))
      .catch(() => setQueue(null));

    ipc
      .getTimerConfig()
      .then((data) => setConfig(data))
      .catch(() => setConfig(null));
  }, []);

  useEvents({
    timer_session_updated: (data) => {
      setSession(data);
    },
    timer_queue_updated: (data) => {
      setQueue(data);
    },
  });

  const setIntent = async (intent: Intent) => {
    ipc.timerSetSessionIntent(intent);
  };

  const play = async () => {
    return ipc.timerPlay().catch((err) => console.log(err));
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
    queue,
    setIntent,
    play,
    stop,
    restart,
    skip,
    config,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    clearQueue,
    incrementQueueSessionIterations,
    decrementQueueSessionIterations,
    updateQueueSessionDuration,
  };
};
