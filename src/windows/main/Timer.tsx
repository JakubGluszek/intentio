import React from "react";
import { MdPauseCircle, MdPlayCircle, MdSkipNext } from "react-icons/md";
import {
  ColorFormat,
  CountdownCircleTimer,
} from "react-countdown-circle-timer";

import { formatTime, playAudio } from "../../utils";
import { Settings } from "../../bindings/Settings";
import useTimer from "./useTimer";
import useGlobal from "../../store";
import { ActiveQueue } from "../../bindings/ActiveQueue";

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
          <button className="btn w-full" onClick={() => timer.pause()}>
            <MdPauseCircle size={24} />
            <span>STOP</span>
          </button>
        ) : (
          <button className="btn w-full" onClick={() => timer.start()}>
            <MdPlayCircle size={24} />
            <span>START</span>
          </button>
        )}
        <button className="btn" onClick={() => timer.next(true)}>
          <MdSkipNext size={24} />
        </button>
      </div>
    </div>
  );
};

export default Timer;
