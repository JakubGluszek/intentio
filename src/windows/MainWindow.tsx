import React from "react";
import {
  MdSettings,
  MdAnalytics,
  MdRemove,
  MdClose,
  MdCheckBox,
  MdStickyNote2,
  MdPlayCircle,
  MdPauseCircle,
  MdSkipNext,
} from "react-icons/md";
import { appWindow } from "@tauri-apps/api/window";
import { Settings } from "../types";
import useSettings from "../hooks/useSettings";
import useTimer from "../hooks/useTimer";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { formatTime } from "../utils";

interface TimerProps {
  settings: Settings;
}

const Timer: React.FC<TimerProps> = ({ settings }) => {
  const timer = useTimer(settings);

  return (
    <div className="grow mx-auto w-fit flex flex-col gap-4 items-center">
      <CountdownCircleTimer
        key={timer.type}
        isPlaying={timer.isRunning}
        duration={timer.duration}
        onUpdate={() => timer.tick()}
        onComplete={() => timer.next()}
        strokeWidth={8}
        size={168}
        colors="#00adb5"
        trailColor="#222831"
      >
        {({ remainingTime }) => (
          <span className="text-4xl">{formatTime(remainingTime)}</span>
        )}
      </CountdownCircleTimer>
      <div className="flex flex-col items-center gap-0.5 text-sm brightness-75">
        <span>#{timer.iterations}</span>
        <span>
          {timer.type === "focus" ? "Time to focus!" : "Time for a break!"}
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

const HomePage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="grow flex flex-col">
      <div className="h-10 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <button className="btn btn-ghost">
            <MdSettings size={32} />
          </button>
          <button className="btn btn-ghost">
            <MdAnalytics size={32} />
          </button>
        </div>
        <div className="flex flex-row items-center gap-2">
          <button className="btn btn-ghost" onClick={() => appWindow.hide()}>
            <MdRemove size={32} />
          </button>
          <button className="btn btn-ghost" onClick={() => appWindow.close()}>
            <MdClose size={32} />
          </button>
        </div>
      </div>
      <div className="grow flex flex-col p-4">
        {settings && <Timer settings={settings} />}
      </div>
      <div className="h-10 flex flex-row items-center justify-between">
        <button className="btn btn-ghost">
          <MdCheckBox size={32} />
        </button>
        <button className="btn btn-ghost">coding</button>
        <button className="btn btn-ghost">
          <MdStickyNote2 size={32} />
        </button>
      </div>
    </div>
  );
};

export default HomePage;
