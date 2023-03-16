import React from "react";
import { MdPauseCircle, MdPlayCircle, MdSkipNext } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";
import Color from "color";

import utils from "@/utils";
import ipc from "@/ipc";
import { Timer } from "@/hooks/useTimer";
import { Button } from "@/components";
import CircleTimer, { ColorFormat } from "@/components/timers/CircleTimer";
import { Theme } from "@/bindings/Theme";

interface Props extends Timer {
  compact: boolean;
  theme: Theme;
  displayTimeLeft: boolean;
}

const TimerView: React.FC<Props> = (props) => {
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

  if (props.compact)
    return (
      <CompactTimerView
        toggleDisplayTimeLeft={toggleDisplayTimeLeft}
        formattedTimeLeft={formattedTimeLeft}
        sessionType={sessionType}
        {...props}
      />
    );

  return (
    <CircleTimerView
      toggleDisplayTimeLeft={toggleDisplayTimeLeft}
      formattedTimeLeft={formattedTimeLeft}
      sessionType={sessionType}
      {...props}
    />
  );
};

interface TimerProps extends Props {
  toggleDisplayTimeLeft: () => void;
  formattedTimeLeft: string;
  sessionType: string;
}

const CompactTimerView: React.FC<TimerProps> = (props) => {
  return (
    <div className="relative grow flex flex-col items-center justify-center bg-window/90 border-2 border-base/80 rounded overflow-clip">
      <div className="z-10 flex flex-col items-center">
        {props.displayTimeLeft ? (
          <React.Fragment>
            <span
              data-tauri-disable-drag
              className="font-mono opacity-80"
              onClick={props.toggleDisplayTimeLeft}
              style={{
                fontSize: 32,
              }}
            >
              {props.formattedTimeLeft}
            </span>
            <span className="text-text/60 whitespace-nowrap text-lg">
              {props.sessionType}
            </span>
          </React.Fragment>
        ) : (
          <span
            className="opacity-80 text-3xl font-bold whitespace-nowrap text-primary"
            data-tauri-disable-drag
            onClick={props.toggleDisplayTimeLeft}
          >
            {props.sessionType}
          </span>
        )}
      </div>
      <div className="z-10">
        <TimerControlers {...props} />
      </div>
      <div
        className="absolute left-0 top-0 h-full bg-primary/20"
        style={{
          width: utils.scale(
            props.elapsedTimeDetailed,
            0,
            props.duration,
            0,
            296
          ),
        }}
      ></div>
    </div>
  );
};

const CircleTimerView: React.FC<TimerProps> = (props) => {
  const textColor = props.isPlaying
    ? props.theme.primary_hex
    : props.theme.text_hex;

  return (
    <div className="grow flex flex-col bg-window/90 border-2 border-base/80 rounded">
      <CircleTimer
        isPlaying={props.isPlaying}
        duration={props.duration}
        elapsedTime={props.elapsedTimeDetailed}
        strokeWidth={6}
        size={210}
        color={
          Color(
            props.isPlaying ? props.theme.primary_hex : props.theme.base_hex
          )
            .alpha(0.8)
            .hex() as ColorFormat
        }
        trailColor={Color(props.theme.window_hex).hex() as ColorFormat}
      >
        <div className="flex flex-col items-center gap-1 justify-center">
          {props.displayTimeLeft ? (
            <React.Fragment>
              <span
                data-tauri-disable-drag
                className="translate-y-4 font-mono opacity-80"
                onClick={props.toggleDisplayTimeLeft}
                style={{
                  fontSize: 40,
                  color: textColor,
                }}
              >
                {props.formattedTimeLeft}
              </span>
              <span className="text-lg text-text/60 whitespace-nowrap">
                {props.sessionType}
              </span>
            </React.Fragment>
          ) : (
            <span
              className="opacity-80 text-3xl font-bold whitespace-nowrap text-primary"
              data-tauri-disable-drag
              onClick={props.toggleDisplayTimeLeft}
              style={{
                color: textColor,
              }}
            >
              {props.sessionType}
            </span>
          )}
        </div>

        <div className="absolute bottom-6 translate-x-1 w-full flex flex-col items-center gap-1 transition-opacity duration-300">
          <TimerControlers {...props} />
        </div>
      </CircleTimer>
    </div>
  );
};

const TimerControlers: React.FC<Props> = (props) => {
  return (
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
  );
};

export default TimerView;
