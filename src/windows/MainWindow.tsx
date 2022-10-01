import React from "react";
import {
  MdSettings,
  MdAnalytics,
  MdRemove,
  MdClose,
  MdCheckBox,
  MdStickyNote2,
  MdPlayCircle,
  MdPauseCircle,
  MdSkipNext,
} from "react-icons/md";
import { appWindow, WebviewWindow } from "@tauri-apps/api/window";
import { Settings, Theme } from "../types";
import useSettings from "../hooks/useSettings";
import useTimer from "../hooks/useTimer";
import {
  ColorFormat,
  CountdownCircleTimer,
} from "react-countdown-circle-timer";
import { formatTime } from "../utils";
import useTheme from "../hooks/useTheme";
import { listen } from "@tauri-apps/api/event";

const HomePage: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const { theme, changeTheme } = useTheme();

  React.useEffect(() => {
    listen<string>("apply_theme", (event) =>
      changeTheme(JSON.parse(event.payload))
    );
    listen<string>("settings_updated", (event) =>
      setSettings(JSON.parse(event.payload))
    );
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col p-4">
      <div className="h-10 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <button
            className="btn btn-ghost"
            onClick={() =>
              new WebviewWindow("settings", {
                url: "/settings",
                decorations: false,
                alwaysOnTop: true,
                title: "settings",
                skipTaskbar: true,
                width: 328,
                height: 480,
                resizable: false,
                fullscreen: false,
              })
            }
          >
            <MdSettings size={32} />
          </button>
          <button className="btn btn-ghost">
            <MdAnalytics size={32} />
          </button>
        </div>
        <div className="flex flex-row items-center gap-2">
          <button className="btn btn-ghost" onClick={() => appWindow.hide()}>
            <MdRemove size={32} />
          </button>
          <button className="btn btn-ghost" onClick={() => appWindow.close()}>
            <MdClose size={32} />
          </button>
        </div>
      </div>
      <div className="grow flex flex-col p-4">
        {settings && <Timer settings={settings} theme={theme} />}
      </div>
      <div className="h-10 flex flex-row items-center justify-between">
        <button className="btn btn-ghost">
          <MdCheckBox size={32} />
        </button>
        <button
          className="btn btn-ghost"
          onClick={() =>
            new WebviewWindow("projects", {
              url: "/projects",
              decorations: false,
              alwaysOnTop: true,
              title: "Projects",
              skipTaskbar: true,
              width: 280,
              height: 360,
              resizable: false,
              fullscreen: false,
            })
          }
        >
          coding
        </button>
        <button className="btn btn-ghost">
          <MdStickyNote2 size={32} />
        </button>
      </div>
    </div>
  );
};

interface TimerProps {
  settings: Settings;
  theme?: Theme;
}

const Timer: React.FC<TimerProps> = ({ settings, theme }) => {
  const timer = useTimer(settings);

  if (!theme) return null;

  return (
    <div className="grow mx-auto w-fit flex flex-col gap-4 items-center">
      <CountdownCircleTimer
        key={timer.type}
        isPlaying={timer.isRunning}
        duration={timer.duration}
        onUpdate={() => timer.tick()}
        onComplete={() => timer.next()}
        strokeWidth={8}
        size={168}
        colors={theme.colors.primary as ColorFormat}
        trailColor={theme.colors.base as ColorFormat}
      >
        {({ remainingTime }) => (
          <span className="text-4xl">{formatTime(remainingTime)}</span>
        )}
      </CountdownCircleTimer>
      <div className="flex flex-col items-center gap-0.5 text-sm brightness-75">
        <span>#{timer.iterations}</span>
        <span>
          {timer.type === "focus" ? "Time to focus!" : "Time for a break!"}
        </span>
      </div>
      <div className="flex flex-row gap-2 w-full h-10">
        {timer.isRunning ? (
          <button className="btn w-full" onClick={() => timer.pause()}>
            <MdPauseCircle size={24} />
            <span>STOP</span>
          </button>
        ) : (
          <button className="btn w-full" onClick={() => timer.start()}>
            <MdPlayCircle size={24} />
            <span>START</span>
          </button>
        )}
        <button className="btn" onClick={() => timer.next(true)}>
          <MdSkipNext size={24} />
        </button>
      </div>
    </div>
  );
};

export default HomePage;
