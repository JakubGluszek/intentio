import React from "react";
import { MdPauseCircle, MdPlayCircle, MdSkipNext } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";
import { FiMaximize, FiMinimize } from "react-icons/fi";
import Color from "color";
import { toast } from "react-hot-toast";

import { useEvents } from "@/hooks";
import useStore from "@/store";
import utils from "@/utils";
import ipc from "@/ipc";
import { Button } from "@/components";
import { Settings } from "@/bindings/Settings";
import { Intent } from "@/bindings/Intent";
import { Theme } from "@/bindings/Theme";
import { ColorFormat } from "./types";
import useTimer, { Timer } from "./useTimer";
import { CountdownCircleTimer } from "./CountdownCircleTimer";

interface Props {
  compact?: boolean;
  toggleCompact: () => void;
  activeIntent?: Intent;
  settings: Settings;
  theme: Theme;
}

const TimerView: React.FC<Props> = (props) => {
  const timer = useTimer(props.settings);
  const store = useStore();

  useEvents({
    script_created: (data) => store.addScript(data),
    script_updated: (data) => store.patchScript(data.id, data),
    script_deleted: (data) => store.removeScript(data.id),
  });

  React.useEffect(() => {
    ipc.getScripts().then((data) => store.setScripts(data));
  }, []);

  return (
    <React.Fragment>
      <div className="relative grow flex flex-col items-center justify-evenly border-2 border-base border-y-0">
        <Button
          className="z-[100] absolute right-2 top-2"
          transparent
          onClick={() => props.toggleCompact()}
        >
          {props.compact ? <FiMaximize size={20} /> : <FiMinimize size={20} />}
        </Button>

        <DefaultView display={!props.compact} {...props} timer={timer} />
        {props.compact && <CompactView timer={timer} />}
      </div>
      <div className="flex flex-row items-center justify-between bg-window p-1.5 py-1 border-2 border-base">
        <span className="text-primary/80 font-bold w-7 text-center">
          #{timer.iterations}
        </span>
        {props.activeIntent ? (
          <div className="w-full flex flex-row items-center gap-0.5 text-text/80">
            <span className="w-full text-center">
              {props.activeIntent.label}
            </span>
          </div>
        ) : null}
        <div className="flex flex-row items-center gap-1">
          {props.compact && (
            <div
              style={{
                position: props.compact ? "absolute" : "relative",
                right: props.compact ? "36px" : undefined,
              }}
              className="flex flex-row items-center gap-1"
            >
              <Button
                transparent
                onClick={() => {
                  timer.restart();
                  toast("Session restarted");
                }}
              >
                <VscDebugRestart size={22} />
              </Button>
              {timer.isRunning ? (
                <Button
                  transparent
                  opacity={0.6}
                  onClick={() => {
                    timer.pause();
                  }}
                >
                  <MdPauseCircle size={28} />
                </Button>
              ) : (
                <Button
                  transparent
                  opacity={0.8}
                  onClick={() => {
                    timer.start();
                  }}
                >
                  <MdPlayCircle size={28} />
                </Button>
              )}
            </div>
          )}
          <Button
            transparent
            onClick={() => {
              timer.next(true);
            }}
          >
            <MdSkipNext size={28} />
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

interface CompactViewProps {
  timer: Timer;
}

const CompactView: React.FC<CompactViewProps> = (props) => {
  return (
    <div className="w-full flex flex-row items-center justify-center font-mono text-2xl font-medium translate-y-0.5">
      {utils.formatTimeTimer(props.timer.timeRemaining)}
    </div>
  );
};

interface DefaultViewProps {
  display: boolean;
  theme: Theme;
  settings: Settings;
  timer: Timer;
}

const DefaultView: React.FC<DefaultViewProps> = (props) => {
  const strokeColor = (
    props.timer.isRunning ? props.theme.primary_hex : props.theme.base_hex
  ) as ColorFormat;

  return (
    <div
      className="relative group"
      style={{
        zIndex: props.display ? undefined : -1,
        position: props.display ? "relative" : "fixed",
        opacity: props.display ? 1.0 : 0.0,
      }}
    >
      <CountdownCircleTimer
        key={props.timer.key}
        isPlaying={props.timer.isRunning}
        duration={props.timer.duration * 60}
        onUpdate={props.timer.onUpdate}
        onComplete={() => {
          ipc.playAudio();
          props.timer.next();
        }}
        strokeWidth={8}
        size={228}
        colors={strokeColor}
        trailColor={
          Color(props.theme.window_hex).darken(0.2).hex() as ColorFormat
        }
      >
        {() => (
          <div className="flex flex-col items-center gap-1 justify-center">
            {props.settings.display_live_countdown ? (
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
                    color: props.timer.isRunning
                      ? props.theme.primary_hex
                      : props.theme.text_hex,
                  }}
                >
                  {utils.formatTimeTimer(props.timer.timeRemaining)}
                </span>
                <span className="text-lg text-text/60 whitespace-nowrap">
                  {props.timer.type === "focus"
                    ? "Focus"
                    : props.timer.type === "break"
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
                  color: props.timer.isRunning
                    ? props.theme.primary_hex
                    : props.theme.text_hex,
                }}
              >
                {props.timer.type === "focus"
                  ? "Focus"
                  : props.timer.type === "break"
                    ? "Break"
                    : "Long break"}
              </span>
            )}
          </div>
        )}
      </CountdownCircleTimer>
      <div className="absolute bottom-4 w-full flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          tabIndex={-2}
          className="text-primary/80 hover:text-primary translate-x-8 translate-y-8"
          onClick={() => {
            props.timer.restart();
            toast("Session restarted");
          }}
        >
          <VscDebugRestart size={24} />
        </button>
        <div className="flex flex-row items-center justify-center gap-2 w-full h-10">
          {props.timer.isRunning ? (
            <Button
              transparent
              opacity={0.6}
              onClick={() => {
                props.timer.pause();
              }}
            >
              <MdPauseCircle size={40} />
            </Button>
          ) : (
            <Button
              transparent
              opacity={0.8}
              onClick={() => {
                props.timer.start();
              }}
            >
              <MdPlayCircle size={40} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerView;
