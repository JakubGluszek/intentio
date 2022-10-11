import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import {
  ColorFormat,
  CountdownCircleTimer,
} from "react-countdown-circle-timer";
import { MdPauseCircle, MdPlayCircle, MdSkipNext } from "react-icons/md";

import { Settings } from "../../types";
import { formatTime, playAudio } from "../../utils";

type TimerType = "focus" | "break" | "long break";

interface TimerProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings | undefined>>;
}

const Timer: React.FC<TimerProps> = ({ settings, setSettings }) => {
  const { timer } = settings;

  const [type, setType] = React.useState<TimerType>("focus");
  const [duration, setDuration] = React.useState(timer.pomodoro_duration);
  const [startedAt, setStartedAt] = React.useState<Date | null>(null);
  const [timeFocused, setTimeFocused] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [iterations, setIterations] = React.useState(0);

  React.useEffect(() => {
    switch (type) {
      case "focus":
        setDuration(timer.pomodoro_duration);
        break;
      case "break":
        setDuration(timer.break_duration);
        break;
      case "long break":
        setDuration(timer.long_break_duration);
        break;
    }
  }, [timer]);

  React.useEffect(() => {
    listen<string>("update_current_theme", (event) =>
      setSettings({
        ...settings,
        theme: { ...settings.theme, current: JSON.parse(event.payload) },
      })
    );
  }, []);

  React.useEffect(() => {
    setTimeFocused(0);
  }, [type]);

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
    invoke("pomodoro_save", {
      duration: timeFocused,
      startedAt,
    });
  };

  const resetPomodoro = () => {
    setTimeFocused(0);
    setStartedAt(null);
  };

  const next = (manual: boolean = false) => {
    pause();
    if (type === "focus") {
      save();
      resetPomodoro();

      const is_long_break =
        iterations >= timer.long_break_interval &&
        iterations % timer.long_break_interval === 0;

      if (is_long_break) {
        setType("long break");
        setDuration(timer.long_break_duration);
      } else {
        setType("break");
        setDuration(timer.break_duration);
      }
      setIterations(iterations + 1);
      if (!manual && timer.auto_start_breaks) {
        setTimeout(() => {
          start();
        }, 1000);
      }
    } else {
      setType("focus");
      setDuration(timer.pomodoro_duration);
      if (!manual && timer.auto_start_pomodoros) {
        setTimeout(() => {
          start();
        }, 1000);
      }
    }
  };

  return (
    <div className="grow mx-auto w-fit flex flex-col gap-4 items-center">
      <CountdownCircleTimer
        key={type}
        isPlaying={isRunning}
        duration={duration}
        onUpdate={() => setTimeFocused((seconds) => seconds + 1)}
        onComplete={() => {
          playAudio();
          next();
        }}
        strokeWidth={8}
        size={168}
        colors={settings.theme.current.colors.primary as ColorFormat}
        trailColor={settings.theme.current.colors.base as ColorFormat}
      >
        {({ remainingTime }) => (
          <span className="text-4xl">{formatTime(remainingTime)}</span>
        )}
      </CountdownCircleTimer>
      <div className="flex flex-col items-center gap-0.5 text-sm brightness-75">
        <span>#{iterations}</span>
        <span>
          {type === "focus"
            ? "Time to focus!"
            : type === "break"
            ? "Time for a break!"
            : "Time for a longer break!"}
        </span>
      </div>
      <div className="flex flex-row gap-2 w-full h-10">
        {isRunning ? (
          <button className="btn w-full" onClick={() => pause()}>
            <MdPauseCircle size={24} />
            <span>STOP</span>
          </button>
        ) : (
          <button className="btn w-full" onClick={() => start()}>
            <MdPlayCircle size={24} />
            <span>START</span>
          </button>
        )}
        <button className="btn" onClick={() => next(true)}>
          <MdSkipNext size={24} />
        </button>
      </div>
    </div>
  );
};

export default Timer;
