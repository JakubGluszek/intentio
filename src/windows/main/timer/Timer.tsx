import React from "react";
import { MdPauseCircle, MdPlayCircle, MdSkipNext } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";
import Color from "color";

import Button from "@/components/Button";
import { ColorFormat } from "@/types";
import { Settings } from "@/bindings/Settings";
import { useStore } from "@/app/store";
import { Intent } from "@/bindings/Intent";
import { Theme } from "@/bindings/Theme";
import utils from "@/utils";
import useTimer from "./useTimer";
import { CountdownCircleTimer } from "./CountdownCircleTimer";
import services from "@/app/services";

interface Props {
  activeIntent?: Intent;
  settings: Settings;
  theme: Theme;
}

const Timer: React.FC<Props> = (props) => {
  const timer = useTimer(props.settings);

  const store = useStore();

  return (
    <>
      <div className="grow flex flex-col items-center justify-evenly">
        {store.currentTheme && (
          <div className="relative group">
            <CountdownCircleTimer
              key={timer.key}
              isPlaying={timer.isRunning}
              duration={timer.duration * 60}
              onUpdate={timer.onUpdate}
              onComplete={() => {
                services.playAudio();
                timer.next();
              }}
              strokeWidth={8}
              size={186}
              colors={store.currentTheme.primary_hex as ColorFormat}
              trailColor={
                Color(store.currentTheme.window_hex)
                  .darken(0.15)
                  .hex() as ColorFormat
              }
            >
              {({ remainingTime }) => (
                <span className="text-[44px] text-primary">
                  {utils.formatTimeTimer(remainingTime)}
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
              }}
            >
              <MdPauseCircle size={48} />
            </Button>
          ) : (
            <Button
              transparent
              onClick={() => {
                timer.start();
              }}
            >
              <MdPlayCircle size={48} />
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <span className="text-primary/80 font-bold w-7 text-center">#0</span>
        {store.activeIntentId ? (
          <div className="flex flex-row items-center gap-0.5 text-text/80">
            <span>{store.getActiveIntent()?.label}</span>
          </div>
        ) : null}
        <Button
          transparent
          onClick={() => {
            timer.next(true);
          }}
        >
          <MdSkipNext size={28} />
        </Button>
      </div>
    </>
  );
};

export default Timer;
