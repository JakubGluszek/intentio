import { invoke } from "@tauri-apps/api/tauri";
import React from "react";
import { Settings } from "../types";

type TimerType = "focus" | "break" | "long break";

const useTimer = (settings: Settings) => {
  const [type, setType] = React.useState<TimerType>("focus");
  const [duration, setDuration] = React.useState(settings.pomodoro_duration);
  const [startedAt, setStartedAt] = React.useState<Date | null>(null);
  const [timeFocused, setTimeFocused] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [iterations, setIterations] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (!isRunning) return;
      if (duration > 0) {
        if (type === "focus") setTimeFocused((t) => t + 1);
        setDuration(duration - 1);
      } else {
        pause();
        next();
      }
    }, 1000);

    return () => clearInterval(timer);
  });

  React.useEffect(() => {
    switch (type) {
      case "focus":
        setDuration(settings.pomodoro_duration);
        break;
      case "break":
        setDuration(settings.break_duration);
        break;
      case "long break":
        setDuration(settings.long_break_duration);
        break;
    }
  }, [settings]);

  const start = () => {
    if (!startedAt) {
      setStartedAt(new Date());
    }
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const save = () => {
    if (type !== "focus" || timeFocused < 4) return;
    invoke("save_pomodoro", {
      duration: timeFocused,
      startedAt,
    });
  };

  const resetPomodoro = () => {
    setTimeFocused(0);
    setStartedAt(null);
  };

  const next = () => {
    if (type === "focus") {
      save();
      resetPomodoro();

      const isLongBreak =
        iterations >= settings.long_break_interval &&
        iterations % settings.long_break_interval === 0;

      if (isLongBreak) {
        setType("long break");
        setDuration(settings.long_break_duration);
      } else {
        setType("break");
        setDuration(settings.break_duration);
      }
      setIterations(iterations + 1);
      if (settings.auto_start_breaks) {
        setTimeout(() => {
          start();
        }, 1000);
      }
    } else {
      setType("focus");
      setDuration(settings.pomodoro_duration);
      if (settings.auto_start_pomodoros) {
        setTimeout(() => {
          start();
        }, 1000);
      }
    }
  };

  return {
    type,
    duration,
    isRunning,
    iterations,
    start,
    pause,
    next,
  };
};

export default useTimer;
