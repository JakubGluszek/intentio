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
import useStore from "@/store";

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
}

const TimerView: React.FC<Props> = (props) => {
  const store = useStore();

  const intent = store.getActiveIntent();

  return (
    <React.Fragment>
      <CircleTimer
        isPlaying={props.session.is_playing}
        duration={props.session.duration}
        elapsedTime={props.elapsedTimeDetailed}
        strokeWidth={6}
        size={230}
        color={
          Color(
            props.session.is_playing
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
                  ipc.updateInterfaceConfig({
                    display_timer_countdown: false,
                  })
                }
                style={{
                  fontSize: 40,
                  color: props.session.is_playing
                    ? props.theme.primary_hex
                    : props.theme.text_hex,
                }}
              >
                {utils.formatTimeTimer(
                  props.session.duration - props.session.elapsed_time
                )}
              </span>
              <span className="text-lg text-text/60 whitespace-nowrap">
                {props.session._type === "Focus"
                  ? "Focus"
                  : props.session._type === "Break"
                    ? "Break"
                    : "Long break"}
              </span>
            </>
          ) : (
            <span
              className="opacity-80 text-3xl font-bold whitespace-nowrap text-primary"
              data-tauri-disable-drag
              onClick={() =>
                ipc.updateInterfaceConfig({
                  display_timer_countdown: true,
                })
              }
              style={{
                color: props.session.is_playing
                  ? props.theme.primary_hex
                  : props.theme.text_hex,
              }}
            >
              {props.session._type === "Focus"
                ? "Focus"
                : props.session._type === "Break"
                  ? "Break"
                  : "Long break"}
            </span>
          )}
        </div>
        <div className="absolute bottom-6 w-full flex flex-col items-center gap-1 transition-opacity duration-300">
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
            {props.session.is_playing ? (
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
          </div>
        </div>
      </CircleTimer>
      <div className="bottom-0 left-0 w-full flex flex-row items-center justify-between gap-0.5 bg-window/90 border-2 border-base/80 rounded">
        <span className="text-primary/80 font-bold text-center p-1.5">
          #{props.session.iterations}
        </span>
        {intent ? (
          <div className="w-full flex flex-row items-center gap-0.5 text-text/80 p-1.5">
            <span className="w-full text-center">{intent.label}</span>
          </div>
        ) : null}
        <div className="flex flex-row items-center gap-1">
          <Button
            transparent
            onClick={() => {
              props.skip();
            }}
          >
            <MdSkipNext size={28} />
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TimerView;
