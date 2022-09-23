import useTimer from "../hooks/useTimer";
import { Settings } from "../types";

interface TimerProps {
  settings: Settings;
}

const Timer: React.FC<TimerProps> = ({ settings }) => {
  const timer = useTimer(settings);

  return (
    <div className="w-full h-full flex flex-col items-center justify-evenly gap-4 p-4">
      <div className="w-full flex flex-row items-center gap-2">
        <button className="btn" onClick={() => timer.change("focus")}>
          Focus
        </button>
        <button className="btn" onClick={() => timer.change("break")}>
          Break
        </button>
        <button className="btn" onClick={() => timer.change("long break")}>
          Long break
        </button>
      </div>
      <span className="text-5xl">{timer.duration}</span>
      <span>{timer.iterations}</span>
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
        <button className="btn w-fit" onClick={() => timer.restart()}>
          Restart
        </button>
      </div>
    </div>
  );
};

export default Timer;
