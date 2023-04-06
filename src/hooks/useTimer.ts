import React from "react";

import { TimerSession } from "@/types";
import { SessionType } from "@/bindings/SessionType";
import { TimerConfig } from "@/bindings/TimerConfig";
import { useElapsedTime } from "./useElapsedTime";

export interface TimerCallbacks {
  onUpdated?: (session: { type: SessionType }) => void;
  onPaused?: (session: { type: SessionType }) => void;
  onResumed?: (session: { type: SessionType }) => void;
  onSkipped?: (session: { type: SessionType }) => void;
  onRestarted?: () => void;
  onCompleted?: (session: { type: SessionType }) => void;
  onSaveSession: (session: Partial<TimerSession>) => void;
}

export interface Timer extends TimerSession {
  resume: () => void;
  pause: () => void;
  restart: () => void;
  skip: (manual?: boolean) => void;
  /** Floating point number for smooth stroke render */
  elapsedTimeDetailed: number;
}

export const useTimer = (
  config: TimerConfig,
  callbacks: TimerCallbacks
): Timer => {
  const [sessionType, setSessionType] = React.useState<SessionType>("Focus");
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(config.focus_duration * 60);
  const [startedAt, setStartedAt] = React.useState<string>(); // epoch in ms
  const [iterations, setIterations] = React.useState(0);

  const resume = React.useCallback(() => {
    if (!startedAt) setStartedAt(new Date().getTime().toString());
    setIsPlaying(true);
    callbacks.onResumed && callbacks.onResumed({ type: sessionType });
  }, [sessionType]);

  const pause = React.useCallback(() => {
    setIsPlaying(false);
    callbacks.onPaused && callbacks.onPaused({ type: sessionType });
  }, [sessionType]);

  const restart = () => {
    pause();
    saveSession();
    reset();
    setStartedAt(undefined);
    callbacks.onRestarted && callbacks.onRestarted();
  };

  const skip = (manual?: boolean) => {
    restart();
    switchSession(manual ?? false);
    if (!manual) {
      if (sessionType === "Focus" && config.auto_start_focus) resume();
      else if (config.auto_start_breaks) resume();
    }
    callbacks.onSkipped && callbacks.onSkipped({ type: sessionType });
  };

  const switchSession = (manual: boolean) => {
    let newSessionType = sessionType;
    let newDuration = duration;

    if (sessionType === "Focus") {
      !manual && setIterations((iterations) => iterations + 1);

      const isLongBreak =
        iterations >= config.long_break_interval &&
        iterations % config.long_break_interval === 0;

      if (isLongBreak) {
        newSessionType = "LongBreak";
        newDuration = config.long_break_duration * 60;
      } else {
        newSessionType = "Break";
        newDuration = config.break_duration * 60;
      }
    } else {
      newSessionType = "Focus";
      newDuration = config.focus_duration * 60;
    }

    setSessionType(newSessionType);
    setDuration(newDuration);
  };

  const saveSession = () => {
    let session = {
      elapsedTime: ~~elapsedTime + 1,
      startedAt,
      type: sessionType,
    };
    callbacks.onSaveSession(session);
  };

  const onComplete = () => {
    skip(false);
    callbacks.onCompleted && callbacks.onCompleted({ type: sessionType });
  };

  const { reset, elapsedTime } = useElapsedTime({
    isPlaying,
    duration,
    onComplete: onComplete,
  });

  React.useEffect(() => {
    let newDuration = duration;

    switch (sessionType) {
      case "Focus":
        newDuration = config.focus_duration;
        break;
      case "Break":
        newDuration = config.break_duration;
        break;
      case "LongBreak":
        newDuration = config.long_break_duration;
        break;
    }

    setDuration(newDuration * 60);
  }, [config]);

  return {
    elapsedTimeDetailed: elapsedTime,
    resume,
    pause,
    restart,
    skip,
    type: sessionType,
    duration,
    elapsedTime: ~~elapsedTime,
    isPlaying,
    iterations,
  };
};
