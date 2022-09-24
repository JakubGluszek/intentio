import React from "react";
import useTimer from "../hooks/useTimer";
import { Settings } from "../types";

interface TimerProps {
  settings: Settings;
}

const Timer: React.FC<TimerProps> = ({ settings }) => {
  const timer = useTimer(settings);

  return (
    <div className="m-auto w-fit h-fit flex flex-col items-center justify-evenly gap-4 p-4">
      <div className="flex flex-col gap-4 items-center">
        <span className="text-5xl">{timer.duration}</span>
        <span>{timer.type}</span>
      </div>
      <div className="w-full flex flex-row items-center gap-2">
        {timer.isRunning ? (
          <button className="btn grow" onClick={() => timer.pause()}>
            Pause
          </button>
        ) : (
          <button className="btn grow" onClick={() => timer.start()}>
            Start
          </button>
        )}
        <button className="btn w-fit" onClick={() => timer.next()}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Timer;
