import React from "react";
import { MdPauseCircle, MdPlayCircle, MdSkipNext } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";
import { clsx } from "@mantine/core";
import Color from "color";

import { Button } from "@/ui";
import utils from "@/utils";
import { Theme } from "@/bindings/Theme";
import { useTimerReturnValues } from "./useTimer";
import { CircleTimer, ColorFormat } from "./CircleTimer";

export interface TimerProps extends useTimerReturnValues {
  theme: Theme;
  displayCountdown: boolean;
  onToggleCountdown: () => void;
}

export const Timer: React.FC<TimerProps> = (props) => {
  const formattedTimeLeft = utils.formatTimer(
    props.duration - props.elapsedTime
  );

  const sessionType =
    props.type === "Focus"
      ? "Focus"
      : props.type === "Break"
        ? "Break"
        : "Long break";

  return (
    <CircleTimer
      isPlaying={props.isPlaying}
      duration={props.duration}
      elapsedTime={props.elapsedTimeDetailed}
      strokeWidth={2}
      size={192}
      color={
        Color(props.isPlaying ? props.theme.primary_hex : props.theme.base_hex)
          .alpha(0.6)
          .hex() as ColorFormat
      }
      trailColor={Color(props.theme.window_hex).hex() as ColorFormat}
    >
      <div className="absolute m-auto">
        {!props.displayCountdown ? (
          <button
            onClick={() => props.onToggleCountdown()}
            className={clsx(
              "text-4xl font-bold whitespace-nowrap transition-colors duration-150",
              props.isPlaying
                ? "text-primary/80 hover:text-primary"
                : "text-base/80 hover:text-[rgb(var(--base-color))]"
            )}
            tabIndex={-3}
          >
            {sessionType}
          </button>
        ) : (
          <div className="translate-y-2 flex flex-col items-center">
            <button
              className={clsx(
                "text-4xl font-semibold font-mono transition-colors duration-150",
                props.isPlaying
                  ? "text-primary/80 hover:text-primary"
                  : "text-base/80 hover:text-[rgb(var(--base-color))]"
              )}
              onClick={() => props.onToggleCountdown()}
              tabIndex={-3}
            >
              {formattedTimeLeft}
            </button>
            <span className="text-lg font-semibold text-text/80 whitespace-nowrap">
              {sessionType}
            </span>
          </div>
        )}
      </div>

      <div className="absolute m-auto translate-y-[4.25rem]  w-full flex flex-col items-center gap-1 transition-opacity duration-150">
        <div className="group flex flex-row items-center justify-center">
          <button
            tabIndex={-3}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-base/80 hover:text-primary"
            onClick={() => props.restart()}
          >
            <VscDebugRestart size={21} />
          </button>

          <Button
            variant="ghost"
            onClick={() => (props.isPlaying ? props.pause() : props.resume())}
            config={{ ghost: { highlight: false } }}
          >
            {props.isPlaying ? (
              <MdPauseCircle size={36} />
            ) : (
              <MdPlayCircle size={36} />
            )}
          </Button>
          <button
            tabIndex={-3}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-base/80 hover:text-primary -translate-x-0.5"
            onClick={() => {
              props.skip(true);
            }}
          >
            <MdSkipNext size={26} />
          </button>
        </div>
      </div>
    </CircleTimer>
  );
};
