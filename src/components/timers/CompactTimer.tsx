import React from "react";
import { MdPauseCircle, MdPlayCircle, MdSkipNext } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";

import ipc from "@/ipc";
import utils from "@/utils";
import { Theme } from "@/bindings/Theme";
import { Timer } from "@/hooks/useTimer";
import { Button } from "@/components";

interface Props extends Timer {
  displayTimeLeft: boolean;
  theme: Theme;
}

const CompactTimer: React.FC<Props> = (props) => {
  const toggleDisplayTimeLeft = () =>
    ipc.updateInterfaceConfig({
      display_timer_countdown: !props.displayTimeLeft,
    });

  const formattedTimeLeft = utils.formatTimeTimer(
    props.duration - props.elapsedTime
  );

  const sessionType =
    props.type === "Focus"
      ? "Focus"
      : props.type === "Break"
        ? "Break"
        : "Long break";

  return (
    <div className="relative grow flex flex-col items-center justify-evenly window overflow-clip">
      <div className="z-10 flex flex-col items-center">
        {props.displayTimeLeft ? (
          <React.Fragment>
            <span className="text-text/80 whitespace-nowrap text-lg">
              {sessionType}
            </span>
            <span
              data-tauri-disable-drag
              className="font-mono translate-y-1"
              onClick={toggleDisplayTimeLeft}
              style={{
                fontSize: 32,
              }}
            >
              {formattedTimeLeft}
            </span>
          </React.Fragment>
        ) : (
          <span
            className="opacity-80 text-3xl font-bold whitespace-nowrap text-primary"
            data-tauri-disable-drag
            onClick={toggleDisplayTimeLeft}
          >
            {sessionType}
          </span>
        )}
      </div>
      <div className="z-10">
        <div className="group flex flex-row items-center justify-center">
          <button
            tabIndex={-2}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-primary/80 hover:text-primary"
            onClick={() => {
              props.restart();
            }}
          >
            <VscDebugRestart size={21} />
          </button>

          {props.isPlaying ? (
            <Button
              transparent
              highlight={false}
              opacity={0.6}
              onClick={() => {
                props.pause();
              }}
            >
              <MdPauseCircle size={36} />
            </Button>
          ) : (
            <Button
              transparent
              highlight={false}
              opacity={0.8}
              onClick={() => {
                props.resume();
              }}
            >
              <MdPlayCircle size={36} />
            </Button>
          )}
          <button
            tabIndex={-2}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-primary/80 hover:text-primary -translate-x-0.5"
            onClick={() => {
              props.skip(true);
            }}
          >
            <MdSkipNext size={26} />
          </button>
        </div>
      </div>
      <div
        className="absolute left-0 top-0 h-full bg-primary/20 transition-[width] duration-300 ease-linear"
        style={{
          width: utils.scale(props.elapsedTime, 0, props.duration, 0, 296),
        }}
      ></div>
    </div>
  );
};

export default CompactTimer;
