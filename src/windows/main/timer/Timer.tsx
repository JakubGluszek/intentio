import React from "react";
import { MdPauseCircle, MdPlayCircle } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";
import toast from "react-hot-toast";

import { formatTimeTimer, playAudio } from "../../../utils";
import { Settings } from "../../../bindings/Settings";
import useTimer from "./useTimer";
import useGlobal from "../../../app/store";
import { SessionQueue } from "../../../bindings/SessionQueue";
import Button from "../../../components/Button";
import { CountdownCircleTimer } from "./CountdownCircleTimer";
import { ColorFormat } from "@/types";

interface TimerProps {
  biRef: { nextFunc?: (manual?: boolean) => void };
  settings: Settings;
  sessionQueue: SessionQueue | null;
}

const Timer: React.FC<TimerProps> = ({ biRef, settings, sessionQueue }) => {
  const timer = useTimer(settings, sessionQueue);
  const theme = useGlobal((state) => state.currentTheme);

  biRef.nextFunc = timer.next;

  return (
    <div className="grow flex flex-col gap-6 items-center justify-center">
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
              <span className="text-4xl">{formatTimeTimer(remainingTime)}</span>
            )}
          </CountdownCircleTimer>
          <div className="absolute bottom-4 w-full flex flex-col items-center gap-1">
            <span className="text-sm text-text/60 whitespace-nowrap">
              {timer.type === "focus"
                ? "Focus"
                : timer.type === "break"
                  ? "Break"
                  : "Long break"}
            </span>
            <Button
              className="text-primary/80 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              transparent
              onClick={() => {
                timer.restart();
                toast("Session restarted", {
                  position: "top-center",
                  duration: 1200,
                });
              }}
            >
              <VscDebugRestart size={24} />
            </Button>
          </div>
        </div>
      )}
      <div className="flex flex-row items-center justify-center gap-2 w-full h-10">
        {timer.isRunning ? (
          <Button
            transparent
            onClick={() => {
              timer.pause();
              toast("Session paused", {
                position: "top-center",
                duration: 1200,
              });
            }}
          >
            <MdPauseCircle size={48} />
          </Button>
        ) : (
          <Button
            transparent
            onClick={() => {
              timer.start();
              toast("Session started", {
                position: "top-center",
                duration: 1200,
              });
            }}
          >
            <MdPlayCircle size={48} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Timer;
