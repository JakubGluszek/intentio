import React from "react";
import { MdPauseCircle, MdPlayCircle, MdSkipNext } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";
import {
  ColorFormat,
  CountdownCircleTimer,
} from "react-countdown-circle-timer";

import { formatTime, playAudio } from "../../utils";
import { Settings } from "../../bindings/Settings";
import useTimer from "./useTimer";
import useGlobal from "../../store";
import { ActiveQueue } from "../../bindings/ActiveQueue";
import toast from "react-hot-toast";

interface TimerProps {
  settings: Settings;
  activeQueue: ActiveQueue | null;
}

const Timer: React.FC<TimerProps> = ({ settings, activeQueue }) => {
  const timer = useTimer(settings, activeQueue);
  const theme = useGlobal((state) => state.currentTheme);

  return (
    <div className="grow mx-auto w-fit flex flex-col gap-4 items-center">
      {theme && (
        <div className="relative group">
          <CountdownCircleTimer
            key={timer.key}
            isPlaying={timer.isRunning}
            duration={timer.duration * 60}
            onUpdate={timer.onUpdate}
            onComplete={() => {
              playAudio();
              timer.next();
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
          <button
            className="absolute bottom-3 left-[70px] btn btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => {
              timer.restart();
              toast("Session restarted", {
                position: "top-center",
                duration: 1200,
              });
            }}
          >
            <VscDebugRestart size={24} />
          </button>
        </div>
      )}
      <div className="flex flex-col items-center gap-0.5 text-sm brightness-75">
        <span>#{timer.iterations}</span>
        <span>
          {timer.type === "focus"
            ? "Time to focus!"
            : timer.type === "break"
              ? "Time for a break!"
              : "Time for a longer break!"}
        </span>
      </div>
      <div className="flex flex-row gap-2 w-full h-10">
        {timer.isRunning ? (
          <button
            className="btn w-full"
            onClick={() => {
              timer.pause();
              toast("Session paused", {
                position: "top-center",
                duration: 1200,
              });
            }}
          >
            <MdPauseCircle size={24} />
            <span>STOP</span>
          </button>
        ) : (
          <button
            className="btn w-full"
            onClick={() => {
              timer.start();
              toast("Session started", {
                position: "top-center",
                duration: 1200,
              });
            }}
          >
            <MdPlayCircle size={24} />
            <span>START</span>
          </button>
        )}
        <button
          className="btn"
          onClick={() => {
            timer.next(true);
            toast("Session skipped", {
              position: "top-center",
              duration: 1200,
            });
          }}
        >
          <MdSkipNext size={24} />
        </button>
      </div>
    </div>
  );
};

export default Timer;
