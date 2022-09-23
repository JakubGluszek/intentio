import React from "react";
import { Settings } from "../types";

type TimerType = "focus" | "break" | "long break";

const useTimer = (settings: Settings) => {
  const [type, setType] = React.useState<TimerType>("focus");
  const [duration, setDuration] = React.useState(settings.pomodoro_duration);
  const [isRunning, setIsRunning] = React.useState(false);
  const [iterations, setIterations] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (!isRunning) return;
      if (duration > 0) {
        setDuration(duration - 1);
      } else {
        save();
        next();
      }
    }, 1000);

    return () => clearInterval(timer);
  });

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const restart = () => {
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
  };

  const save = () => {
    if (duration < 60) return;
  };

  const next = () => {
    if (type === "focus") {
      if (
        iterations >= settings.long_break_interval &&
        iterations % settings.long_break_interval === 0
      ) {
        setType("long break");
        setDuration(settings.long_break_duration);
      } else {
        setType("break");
        setDuration(settings.break_duration);
      }
      setIterations(iterations + 1);
    } else {
      setType("focus");
      setDuration(settings.pomodoro_duration);
    }
  };

  const change = (type: TimerType) => {
    setType(type);
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
  };

  return {
    type,
    duration,
    isRunning,
    iterations,
    start,
    pause,
    restart,
    change,
  };
};

export default useTimer;
