import React from "react";
import { Settings } from "../types";

type TimerType = "focus" | "break" | "long break";

const useTimer = (settings: Settings) => {
  const [type, setType] = React.useState<TimerType>("focus");
  const [duration, setDuration] = React.useState(settings.pomodoro_duration);
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
        save();
        next();
      }
    }, 1000);

    return () => clearInterval(timer);
  });

  React.useEffect(() => {
    restart();
  }, [settings]);

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const restart = () => {
    switch (type) {
      case "focus":
        save();
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
    if (timeFocused < 60) {
      // perform save here
    }
    setTimeFocused(0);
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
      if (settings.auto_start_breaks) {
        start();
      }
      save();
    } else {
      setType("focus");
      setDuration(settings.pomodoro_duration);
      if (settings.auto_start_pomodoros) {
        start();
      }
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
    next,
    change,
  };
};

export default useTimer;
