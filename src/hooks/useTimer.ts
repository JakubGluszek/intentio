import React from "react";

import ipc from "@/ipc";
import { QueueSession } from "@/bindings/QueueSession";
import { TimerSession } from "@/bindings/TimerSession";
import { Intent } from "@/bindings/Intent";
import { CreateTimerSession } from "@/bindings/CreateTimerSession";
import { TimerConfig } from "@/bindings/TimerConfig";
import useEvents from "./useEvents";

export const useTimer = () => {
  const [session, setSession] = React.useState<TimerSession>();
  const [config, setConfig] = React.useState<TimerConfig>();

  React.useEffect(() => {
    ipc.timerGetSession().then((data) => setSession(data));
    ipc.getTimerConfig().then((data) => setConfig(data));
  }, []);

  useEvents({
    timer_session_updated: (data) => {
      console.log(JSON.stringify(data));
      setSession(data);
    },
  });

  const setSessionByIntent = async (intent: Intent) => {
    if (!config) throw Error("Cannot set session without timer config");

    let data: CreateTimerSession = {
      _type: "Focus",
      duration: config.focus_duration,
      intent,
    };
    ipc.timerSetSession(data);
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
    session,
    setSessionByIntent,
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
