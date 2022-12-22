import React from "react";
import { MdPauseCircle, MdPlayCircle } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";
import toast from "react-hot-toast";

import { formatTimeTimer, playAudio } from "../../../utils";
import useTimer from "./useTimer";
import Button from "../../../components/Button";
import { CountdownCircleTimer } from "./CountdownCircleTimer";
import { ColorFormat } from "@/types";
import Color from "color";
import { State } from "@/bindings/State";
import { Settings } from "@/bindings/Settings";
import { useStore } from "@/app/store";

interface Props {
  biRef: { nextFunc?: (manual?: boolean) => void };
  state: State;
  settings: Settings;
}

const Timer: React.FC<Props> = (props) => {
  const timer = useTimer(props.settings, props.state.session_queue);
  const currentTheme = useStore((state) => state.currentTheme);

  props.biRef.nextFunc = timer.next;

  return (
    <div className="grow flex flex-col items-center justify-evenly">
      {currentTheme && (
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
            strokeWidth={10}
            size={192}
            colors={currentTheme.primary_hex as ColorFormat}
            trailColor={
              Color(currentTheme.primary_hex).darken(0.75).hex() as ColorFormat
            }
          >
            {({ remainingTime }) => (
              <span className="text-[44px] text-primary">
                {formatTimeTimer(remainingTime)}
              </span>
            )}
          </CountdownCircleTimer>
          <div className="absolute bottom-4 w-full flex flex-col items-center gap-1">
            <span className="text-lg text-text/60 whitespace-nowrap">
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
