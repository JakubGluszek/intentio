import React from "react";
import { emit } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { Checkbox } from "@mantine/core";
import { MdTimer } from "react-icons/md";

import { formatTime } from "../../utils";
import { Settings } from "../../types";
import { Slider } from "../../components";

interface Props {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings | undefined>>;
}

const TimerSection: React.FC<Props> = ({ settings, setSettings }) => {
  const settingsRef = React.useRef<Settings>();
  settingsRef.current = settings;

  const updateSettings = (update: Settings) => {
    invoke<Settings>("settings_update", {
      settings: update,
    }).then(onUpdateSettingsSuccess);
  };

  const onUpdateSettingsSuccess = (s: Settings) => {
    setSettings(s);
    emit("settings_updated", s);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-center gap-2">
        <MdTimer size={28} />
        <span className="text-lg">Timer</span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="group card flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Focus</span>
            <div className="bg-base group-hover:bg-window rounded px-2 py-1">
              <span className="text-xs">
                {formatTime(settings.timer.pomodoro_duration)}
              </span>
            </div>
            <Slider
              min={1}
              max={90}
              defaultValue={settings.timer.pomodoro_duration / 60}
              onChangeEnd={(minutes) =>
                updateSettings({
                  ...settingsRef.current!,
                  timer: {
                    ...settingsRef.current?.timer!,
                    pomodoro_duration: minutes * 60,
                  },
                })
              }
            />
          </div>
          <div className="group card flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Break</span>
            <div className="group-hover:bg-window bg-base rounded px-2 py-1">
              <span className="text-xs">
                {formatTime(settings.timer.break_duration)}
              </span>
            </div>
            <Slider
              min={1}
              max={25}
              defaultValue={settings.timer.break_duration / 60}
              onChangeEnd={(minutes) =>
                updateSettings({
                  ...settingsRef.current!,
                  timer: {
                    ...settingsRef.current?.timer!,
                    break_duration: minutes * 60,
                  },
                })
              }
            />
          </div>
          <div className="group card flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Long Break</span>
            <div className="bg-base group-hover:bg-window rounded px-2 py-1">
              <span className="text-xs">
                {formatTime(settings.timer.long_break_duration)}
              </span>
            </div>
            <Slider
              min={1}
              max={45}
              defaultValue={settings.timer.long_break_duration / 60}
              onChangeEnd={(minutes) =>
                updateSettings({
                  ...settingsRef.current!,
                  timer: {
                    ...settingsRef.current?.timer!,
                    long_break_duration: minutes * 60,
                  },
                })
              }
            />
          </div>
          <div className="group card flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Long Break Interval</span>
            <div className="bg-base group-hover:bg-window rounded px-2 py-1">
              <span className="text-xs">
                {settings.timer.long_break_interval}
              </span>
            </div>
            <Slider
              min={2}
              max={16}
              defaultValue={settings.timer.long_break_interval}
              onChangeEnd={(intervals) =>
                updateSettings({
                  ...settingsRef.current!,
                  timer: {
                    ...settingsRef.current?.timer!,
                    long_break_interval: intervals,
                  },
                })
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between rounded hover:bg-base p-2">
            <span>Auto Start Pomodoros</span>
            <Checkbox
              defaultChecked={settings.timer.auto_start_pomodoros}
              onChange={(value) =>
                updateSettings({
                  ...settingsRef.current!,
                  timer: {
                    ...settingsRef.current?.timer!,
                    auto_start_pomodoros: value.currentTarget.checked,
                  },
                })
              }
              classNames={{
                input:
                  "border-primary checked:border-primary bg-transparent checked:bg-transparent border-2",
                icon: "text-primary",
              }}
            />
          </div>
          <div className="flex flex-row items-center justify-between rounded hover:bg-base p-2">
            <span>Auto Start Breaks</span>
            <Checkbox
              defaultChecked={settings.timer.auto_start_breaks}
              onChange={(value) =>
                updateSettings({
                  ...settingsRef.current!,
                  timer: {
                    ...settingsRef.current?.timer!,
                    auto_start_breaks: value.currentTarget.checked,
                  },
                })
              }
              classNames={{
                input:
                  "border-primary checked:border-primary bg-transparent checked:bg-transparent border-2",
                icon: "text-primary",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerSection;
