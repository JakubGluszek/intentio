import React from "react";
import { MdPauseCircle, MdPlayCircle, MdSkipNext } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";
import Color from "color";
import { toast } from "react-hot-toast";

import utils from "@/utils";
import ipc from "@/ipc";
import { Button } from "@/components";
import { Theme } from "@/bindings/Theme";
import { Timer } from "@/hooks/useTimer";
import CircleTimer, { ColorFormat } from "@/components/timers/CircleTimer";
import { Intent } from "@/bindings/Intent";

type TimerVariant = "circle" | "compact";

interface TimerStyles {
  circle?: { opacity?: number; circleSize?: number };
  compact?: { opacity?: number };
}

interface Props extends Timer {
  variant?: TimerVariant;
  styles?: TimerStyles;
  theme: Theme;
  displayTime: boolean;
  intent?: Intent;
}

const TimerView: React.FC<Props> = (props) => {
  return (
    <React.Fragment>
      <CircleTimer
        isPlaying={props.state.isPlaying}
        duration={props.state.duration}
        elapsedTime={props.elapsedTimeDetailed}
        strokeWidth={11}
        size={240}
        color={
          Color(
            props.state.isPlaying
              ? props.theme.primary_hex
              : props.theme.base_hex
          )
            .alpha(0.8)
            .hex() as ColorFormat
        }
        trailColor={Color(props.theme.window_hex).hex() as ColorFormat}
      >
        <div className="flex flex-col items-center gap-1 justify-center">
          {props.displayTime ? (
            <>
              <span
                data-tauri-disable-drag
                className="translate-y-4 font-mono opacity-80"
                onClick={() =>
                  ipc.updateSettings({
                    display_live_countdown: false,
                  })
                }
                style={{
                  fontSize: 44,
                  color: props.state.isPlaying
                    ? props.theme.primary_hex
                    : props.theme.text_hex,
                }}
              >
                {utils.formatTimeTimer(
                  props.state.duration - props.state.elapsedTime
                )}
              </span>
              <span className="text-lg text-text/60 whitespace-nowrap">
                {props.state.type === "focus"
                  ? "Focus"
                  : props.state.type === "break"
                    ? "Break"
                    : "Long break"}
              </span>
            </>
          ) : (
            <span
              className="opacity-80 text-3xl font-bold whitespace-nowrap text-primary"
              data-tauri-disable-drag
              onClick={() =>
                ipc.updateSettings({
                  display_live_countdown: true,
                })
              }
              style={{
                color: props.state.isPlaying
                  ? props.theme.primary_hex
                  : props.theme.text_hex,
              }}
            >
              {props.state.type === "focus"
                ? "Focus"
                : props.state.type === "break"
                  ? "Break"
                  : "Long break"}
            </span>
          )}
        </div>
        <div className="absolute bottom-12 w-full flex flex-col items-center gap-1 transition-opacity duration-300">
          <button
            tabIndex={-2}
            className="text-primary/80 hover:text-primary translate-x-8 translate-y-8"
            onClick={() => {
              props.restart();
              toast("Session restarted");
            }}
          >
            <VscDebugRestart size={24} />
          </button>
          <div className="flex flex-row items-center justify-center gap-2 w-full h-10">
            {props.state.isPlaying ? (
              <Button
                transparent
                opacity={0.6}
                onClick={() => {
                  props.pause();
                }}
              >
                <MdPauseCircle size={40} />
              </Button>
            ) : (
              <Button
                transparent
                opacity={0.8}
                onClick={() => {
                  props.resume();
                }}
              >
                <MdPlayCircle size={40} />
              </Button>
            )}
          </div>
        </div>
      </CircleTimer>
    </React.Fragment>
  );
};

export default TimerView;
