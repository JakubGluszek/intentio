import React from "react";
import { MdPauseCircle, MdPlayCircle, MdSkipNext } from "react-icons/md";
import {
  ColorFormat,
  CountdownCircleTimer,
} from "react-countdown-circle-timer";

import { formatTime, playAudio } from "../../utils";
import { Settings } from "../../bindings/Settings";
import { ipc_invoke } from "../../ipc";
import useGlobal from "../../store";
import { sendNotification } from "@tauri-apps/api/notification";

type TimerType = "focus" | "break" | "long break";

interface TimerProps {
  settings: Settings;
}

const Timer: React.FC<TimerProps> = ({ settings }) => {
  const [type, setType] = React.useState<TimerType>("focus");
  const [duration, setDuration] = React.useState(settings.pomodoro_duration);
  const [startedAt, setStartedAt] = React.useState<Date | null>(null);
  const [timeFocused, setTimeFocused] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [iterations, setIterations] = React.useState(0);

  const theme = useGlobal((state) => state.currentTheme);
  const currentProject = useGlobal((state) => state.currentProject);

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
    if (type !== "focus" || timeFocused + 1 < 60) return;
    ipc_invoke("create_session", {
      data: {
        duration: ~~((timeFocused + 1) / 60),
        started_at: startedAt && startedAt.getTime().toString(),
        project_id: currentProject?.id,
      },
    })
      .then(() => console.log("saved focus"))
      .catch((err) => console.log(err));
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
        iterations >= settings.long_break_interval &&
        iterations % settings.long_break_interval === 0;

      if (is_long_break) {
        setType("long break");
        setDuration(settings.long_break_duration);
        if (!manual) {
          sendNotification({
            title: "Pomodoro",
            body: "Session is over. Time for a long break!",
          });
        }
      } else {
        setType("break");
        setDuration(settings.break_duration);
        if (!manual) {
          sendNotification({
            title: "Pomodoro",
            body: "Session is over. Time for a break!",
          });
        }
      }
      setIterations(iterations + 1);
      if (!manual && settings.auto_start_breaks) {
        setTimeout(() => {
          start();
        }, 1000);
      }
    } else {
      setType("focus");
      setDuration(settings.pomodoro_duration);

      if (!manual) {
        sendNotification({
          title: "Pomodoro",
          body: "Break is over. Time to focus!",
        });
      }

      if (!manual && settings.auto_start_pomodoros) {
        setTimeout(() => {
          start();
        }, 1000);
      }
    }
  };

  return (
    <div className="grow mx-auto w-fit flex flex-col gap-4 items-center">
      {theme && (
        <CountdownCircleTimer
          key={type}
          isPlaying={isRunning}
          duration={duration * 60}
          onUpdate={() => setTimeFocused((seconds) => seconds + 1)}
          onComplete={() => {
            playAudio();
            next();
          }}
          strokeWidth={8}
          size={168}
          colors={theme.primary_hex as ColorFormat}
          trailColor={theme.base_hex as ColorFormat}
        >
          {({ remainingTime }) => (
            <span className="text-4xl">{formatTime(remainingTime)}</span>
          )}
        </CountdownCircleTimer>
      )}
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
