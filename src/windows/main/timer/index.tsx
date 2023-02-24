import React from "react";
import { MdPauseCircle, MdPlayCircle, MdSkipNext } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";
import Color from "color";
import { toast } from "react-hot-toast";

import { useEvents } from "@/hooks";
import useStore from "@/store";
import utils from "@/utils";
import { ColorFormat } from "@/types";
import ipc from "@/ipc";
import Button from "@/components/Button";
import { Settings } from "@/bindings/Settings";
import { Intent } from "@/bindings/Intent";
import { Theme } from "@/bindings/Theme";
import useTimer from "./useTimer";
import { CountdownCircleTimer } from "./CountdownCircleTimer";

interface Props {
  activeIntent?: Intent;
  settings: Settings;
  theme: Theme;
}

const Timer: React.FC<Props> = (props) => {
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

  const strokeColor = (
    timer.isRunning ? props.theme.primary_hex : props.theme.base_hex
  ) as ColorFormat;

  return (
    <>
      <div className="grow flex flex-col items-center justify-evenly">
        <div className="relative group">
          <CountdownCircleTimer
            key={timer.key}
            isPlaying={timer.isRunning}
            duration={timer.duration * 60}
            onUpdate={timer.onUpdate}
            onComplete={() => {
              ipc.playAudio();
              timer.next();
            }}
            strokeWidth={8}
            size={186}
            colors={strokeColor}
            trailColor={
              Color(props.theme.window_hex).darken(0.2).hex() as ColorFormat
            }
          >
            {({ remainingTime }) => (
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
                        color: timer.isRunning
                          ? props.theme.primary_hex
                          : props.theme.text_hex,
                      }}
                    >
                      {utils.formatTimeTimer(remainingTime)}
                    </span>
                    <span className="text-lg text-text/60 whitespace-nowrap">
                      {timer.type === "focus"
                        ? "Focus"
                        : timer.type === "break"
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
                      color: timer.isRunning
                        ? props.theme.primary_hex
                        : props.theme.text_hex,
                    }}
                  >
                    {timer.type === "focus"
                      ? "Focus"
                      : timer.type === "break"
                        ? "Break"
                        : "Long break"}
                  </span>
                )}
              </div>
            )}
          </CountdownCircleTimer>
          <div className="absolute bottom-4 w-full flex flex-col items-center gap-1">
            <button
              tabIndex={-2}
              className="text-primary/80 hover:text-primary opacity-0 group-hover:opacity-100"
              onClick={() => {
                timer.restart();
                toast("Session restarted");
              }}
            >
              <VscDebugRestart size={24} />
            </button>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center gap-2 w-full h-10">
          {timer.isRunning ? (
            <Button
              transparent
              opacity={0.6}
              onClick={() => {
                timer.pause();
              }}
            >
              <MdPauseCircle size={48} />
            </Button>
          ) : (
            <Button
              transparent
              opacity={0.8}
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
        <span className="text-primary/80 font-bold w-7 text-center">
          #{timer.iterations}
        </span>
        {props.activeIntent ? (
          <div className="flex flex-row items-center gap-0.5 text-text/80">
            <span>{props.activeIntent.label}</span>
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
