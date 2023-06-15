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
  onSaveSession?: (session: Partial<TimerSession>) => void;
  onStateUpdate?: (state: Partial<TimerSession>) => void;
}

export interface useTimerReturnValues extends TimerSession {
  resume: () => void;
  pause: () => void;
  restart: () => void;
  skip: (manual?: boolean) => void;
  /** Floating point number for smooth stroke render */
  elapsedTimeDetailed: number;
  config: TimerConfig;
}

export const useTimer = (
  config: TimerConfig = {
    focus_duration: 25 * 60,
    break_duration: 5 * 60,
    long_break_duration: 10 * 60,
    long_break_interval: 4,
    auto_start_focus: true,
    auto_start_breaks: true,
    session_summary: false,
  },
  callbacks: TimerCallbacks
): useTimerReturnValues => {
  const [sessionType, setSessionType] = React.useState<SessionType>("Focus");
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(config.focus_duration * 60);
  const [startedAt, setStartedAt] = React.useState<Date>(); // epoch in ms
  const [iterations, setIterations] = React.useState(0);
  const [elapsedTime, setElapsedTime] = React.useState(0);

  const resume = React.useCallback(
    (withCallback: boolean = true) => {
      if (!startedAt) setStartedAt(new Date());
      setIsPlaying(true);
      withCallback && callbacks.onResumed?.({ type: sessionType });
      callbacks.onStateUpdate?.({ isPlaying: true });
    },
    [sessionType, callbacks, startedAt]
  );

  const pause = React.useCallback(
    (withCallback: boolean = true) => {
      setIsPlaying(false);
      withCallback && callbacks.onPaused?.({ type: sessionType });
      callbacks.onStateUpdate?.({ isPlaying: false });
    },
    [sessionType, callbacks]
  );

  const restart = () => {
    pause(false);
    saveSession();
    reset();
    setStartedAt(undefined);
    callbacks.onRestarted?.();
  };

  const skip = React.useCallback(
    (manual?: boolean) => {
      restart();
      switchSession(manual ?? false);
      callbacks.onSkipped?.({ type: sessionType });
    },
    [sessionType, isPlaying, config, startedAt, elapsedTime]
  );

  const switchSession = React.useCallback(
    (manual: boolean) => {
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

      callbacks.onStateUpdate?.({ type: newSessionType, isPlaying: false });

      if (!manual) {
        if (newSessionType === "Focus" && config.auto_start_focus)
          resume(false);
        else if (config.auto_start_breaks) resume(false);
      }
    },
    [sessionType, config, isPlaying, startedAt]
  );

  const onComplete = React.useCallback(() => {
    skip(false);
    callbacks.onCompleted?.({ type: sessionType });
  }, [sessionType, isPlaying, config, startedAt, elapsedTime]);

  const { reset } = useElapsedTime({
    isPlaying,
    duration,
    onComplete: onComplete,
    onUpdate: (elapsedTime) => setElapsedTime(elapsedTime),
  });

  const saveSession = React.useCallback(() => {
    let session = {
      elapsedTime: ~~elapsedTime + 1,
      startedAt,
      type: sessionType,
    };
    callbacks.onSaveSession?.(session);
  }, [elapsedTime, startedAt, sessionType]);

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
    config,
  };
};
