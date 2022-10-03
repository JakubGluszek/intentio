import { appWindow } from "@tauri-apps/api/window";
import React from "react";
import {
  MdAdd,
  MdAddCircle,
  MdCircle,
  MdClose,
  MdColorLens,
  MdInfoOutline,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdNotifications,
  MdRefresh,
  MdRemove,
  MdSettings,
  MdTimer,
  MdVolumeUp,
} from "react-icons/md";
import { AiFillFolder, AiFillFolderOpen } from "react-icons/ai";
import { Checkbox } from "@mantine/core";
import { Settings } from "../types";
import useTheme from "../hooks/useTheme";
import { formatTime } from "../utils";
import { invoke } from "@tauri-apps/api/tauri";
import { Slider } from "../components";
import { emit } from "@tauri-apps/api/event";

const SettingsWindow: React.FC = () => {
  const [settings, setSettings] = React.useState<Settings>();
  const settingsRef = React.useRef<Settings>();
  settingsRef.current = settings;

  const { theme, themes, updateCurrentTheme } = useTheme();

  React.useEffect(() => {
    invoke<Settings>("read_settings").then((s) => setSettings(s));
  }, []);

  const updateSettingsSuccess = (s: Settings) => {
    setSettings(s);
    emit("settings_updated", s);
  };

  if (!settings) {
    return <div>loading</div>;
  }

  return (
    <div className="w-screen min-h-screen flex flex-col gap-2">
      {/* Window Header */}
      <div className="z-[9999] sticky top-0 flex flex-col gap-2 bg-window px-4 py-2">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <MdSettings size={32} />
            <span>Settings</span>
          </div>
          <button className="btn btn-ghost" onClick={() => appWindow.close()}>
            <MdClose size={32} />
          </button>
        </div>
      </div>
      {/* Main */}
      <div className="flex flex-col gap-6 px-4 py-2">
        {/* Timer */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-center gap-2">
            <MdTimer size={28} />
            <span className="text-lg">Timer</span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium">Focus</span>
                <div className="bg-base rounded px-2 py-1">
                  <span className="text-xs">
                    {formatTime(settings.pomodoro_duration)}
                  </span>
                </div>
                <Slider
                  min={1}
                  max={90}
                  defaultValue={settings.pomodoro_duration}
                  onChangeEnd={(minutes) =>
                    invoke<Settings>("update_settings", {
                      settings: {
                        ...settingsRef.current,
                        pomodoro_duration: minutes * 60,
                      },
                    }).then(updateSettingsSuccess)
                  }
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium">Break</span>
                <div className="bg-base rounded px-2 py-1">
                  <span className="text-xs">
                    {formatTime(settings.break_duration)}
                  </span>
                </div>
              </div>
              <Slider
                min={1}
                max={25}
                defaultValue={settings.break_duration}
                onChangeEnd={(minutes) =>
                  invoke<Settings>("update_settings", {
                    settings: {
                      ...settingsRef.current,
                      break_duration: minutes * 60,
                    },
                  }).then(updateSettingsSuccess)
                }
              />
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium">Long Break</span>
                <div className="bg-base rounded px-2 py-1">
                  <span className="text-xs">
                    {formatTime(settings.long_break_duration)}
                  </span>
                </div>
                <Slider
                  min={1}
                  max={45}
                  defaultValue={settings.long_break_duration}
                  onChangeEnd={(minutes) =>
                    invoke<Settings>("update_settings", {
                      settings: {
                        ...settingsRef.current,
                        long_break_duration: minutes * 60,
                      },
                    }).then(updateSettingsSuccess)
                  }
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium">Long Break Interval</span>
                <div className="bg-base rounded px-2 py-1">
                  <span className="text-xs">
                    {settings.long_break_interval}
                  </span>
                </div>
                <Slider
                  min={2}
                  max={16}
                  defaultValue={settings.long_break_interval}
                  onChangeEnd={(intervals) =>
                    invoke<Settings>("update_settings", {
                      settings: {
                        ...settingsRef.current,
                        long_break_interval: intervals,
                      },
                    }).then(updateSettingsSuccess)
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center justify-between">
                <span>Auto Start Pomodoros</span>
                <Checkbox
                  classNames={{
                    input:
                      "border-primary checked:border-primary bg-window checked:bg-window border-2",
                    icon: "text-primary",
                  }}
                />
              </div>
              <div className="flex flex-row items-center justify-between">
                <span>Auto Start Breaks</span>
                <Checkbox
                  classNames={{
                    input:
                      "border-primary checked:border-primary bg-window checked:bg-window border-2",
                    icon: "text-primary",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Alerts */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-center gap-2">
            <div className="flex flex-row items-center ml-auto gap-2">
              <MdNotifications size={28} />
              <span className="text-lg">Alerts</span>
            </div>
            <button className="btn btn-ghost ml-auto">
              <MdRefresh size={24} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <AlertSectionView />
            <div className="flex flex-row items-center gap-4">
              <MdVolumeUp size={24} />
              <Slider onChangeEnd={() => null} />
            </div>
            <div className="flex flex-row items-center gap-4">
              <span>Repeat</span>
              <div className="flex flex-row items-center px-2 gap-2 bg-base rounded">
                <button className="btn btn-ghost" onMouseUp={() => null}>
                  <MdRemove size={24} />
                </button>
                <span>{settings.alert.repeat}</span>
                <button className="btn btn-ghost" onMouseUp={() => null}>
                  <MdAdd size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Themes */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-center gap-2">
            <MdColorLens size={28} />
            <span className="text-lg">Themes</span>
          </div>
          <div className="flex flex-col gap-4">
            <button className="btn btn-ghost justify-start">
              <MdAddCircle size={24} />
              <span>Add custom theme</span>
            </button>
            <div className="flex flex-col gap-2">
              {themes &&
                themes.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      backgroundColor: t.colors.window,
                      border: t.colors.base,
                    }}
                    className={`relative h-10 flex flex-row items-center gap-4 rounded border-2`}
                    onMouseUp={() => updateCurrentTheme(t)}
                  >
                    <div
                      style={{ backgroundColor: t.colors.primary }}
                      className={`w-12 h-full rounded-l`}
                    ></div>
                    <span style={{ color: t.colors.text }}>{t.name}</span>
                    <div
                      style={{ backgroundColor: t.colors.primary }}
                      className="w-full h-0.5 absolute bottom-0 rounded-b"
                    ></div>
                    {t.id === theme?.id && (
                      <MdCircle
                        size={16}
                        className="absolute top-auto bottom-auto right-4 text-primary"
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* About */}
        <div className="flex flex-row items-center justify-center gap-2">
          <MdInfoOutline size={28} />
          <span className="text-lg">About</span>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <span>Version</span>
            <div className="bg-base rounded px-2 py-1">
              <span>0.0.0</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span>Author</span>
            <div className="bg-base rounded px-2 py-1">
              <span>Jakub Głuszek</span>
            </div>
            <div className="bg-base rounded px-2 py-1">
              <span>jacobgluszek03@gmail.com</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span>Source Code</span>
            <div className="bg-base rounded px-2 py-1">
              <span>Github</span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-evenly gap-4">
            <button className="btn btn-ghost">Provide feedback</button>
            <button className="btn btn-ghost">Report a bug</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertSectionView = () => {
  const [folderIcon, setFolderIcon] = React.useState<"open" | "closed">(
    "closed"
  );

  return (
    <div className="flex flex-row items-center gap-4">
      <span>Sound</span>
      <div className="grow flex flex-row items-center justify-between px-2 bg-base rounded">
        <button className="btn btn-ghost">
          <MdKeyboardArrowLeft size={24} />
        </button>
        <span>Default</span>
        <button className="btn btn-ghost">
          <MdKeyboardArrowRight size={24} />
        </button>
      </div>
      <button
        className="btn btn-ghost"
        onMouseEnter={() => setFolderIcon("open")}
        onMouseLeave={() => setFolderIcon("closed")}
      >
        {folderIcon === "closed" ? (
          <AiFillFolder size={32} />
        ) : (
          <AiFillFolderOpen size={32} />
        )}
      </button>
    </div>
  );
};

export default SettingsWindow;
