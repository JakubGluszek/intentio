import React from "react";
import { MdTimer } from "react-icons/md";
import { Checkbox } from "@mantine/core";
import { emit } from "@tauri-apps/api/event";

import { formatTime } from "../../utils";
import { Slider } from "../../components";
import { Settings } from "../../bindings/Settings";
import { ipc_invoke } from "../../ipc";
import { SettingsForUpdate } from "../../bindings/SettingsForUpdate";

interface Props {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings | undefined>>;
}

const TimerSection: React.FC<Props> = ({ settings, setSettings }) => {
  const settingsRef = React.useRef<Settings>();
  settingsRef.current = settings;

  const updateSettings = (update: SettingsForUpdate) => {
    ipc_invoke<Settings>("update_settings", { data: update }).then((res) => {
      setSettings(res.data);
      emit("sync_settings", res.data);
    });
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
                {formatTime(settings.pomodoro_duration * 60)}
              </span>
            </div>
            <Slider
              min={1}
              max={90}
              defaultValue={settings.pomodoro_duration}
              onChangeEnd={(minutes) =>
                updateSettings({
                  pomodoro_duration: minutes,
                })
              }
            />
          </div>
          <div className="group card flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Break</span>
            <div className="group-hover:bg-window bg-base rounded px-2 py-1">
              <span className="text-xs">
                {formatTime(settings.break_duration * 60)}
              </span>
            </div>
            <Slider
              min={1}
              max={25}
              defaultValue={settings.break_duration}
              onChangeEnd={(minutes) =>
                updateSettings({
                  break_duration: minutes,
                })
              }
            />
          </div>
          <div className="group card flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Long Break</span>
            <div className="bg-base group-hover:bg-window rounded px-2 py-1">
              <span className="text-xs">
                {formatTime(settings.long_break_duration * 60)}
              </span>
            </div>
            <Slider
              min={1}
              max={45}
              defaultValue={settings.long_break_duration}
              onChangeEnd={(minutes) =>
                updateSettings({
                  long_break_duration: minutes,
                })
              }
            />
          </div>
          <div className="group card flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Long Break Interval</span>
            <div className="bg-base group-hover:bg-window rounded px-2 py-1">
              <span className="text-xs">{settings.long_break_interval}</span>
            </div>
            <Slider
              min={2}
              max={16}
              defaultValue={settings.long_break_interval}
              onChangeEnd={(intervals) =>
                updateSettings({
                  long_break_interval: intervals,
                })
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between rounded hover:bg-base p-2">
            <span>Auto Start Pomodoros</span>
            <Checkbox
              defaultChecked={settings.auto_start_pomodoros}
              onChange={(value) =>
                updateSettings({
                  auto_start_pomodoros: value.currentTarget.checked,
                })
              }
              styles={{ icon: { color: "var(--primary-color) !important" } }}
              classNames={{
                input:
                  "border-primary checked:border-primary bg-transparent checked:bg-transparent border-2",
              }}
            />
          </div>
          <div className="flex flex-row items-center justify-between rounded hover:bg-base p-2">
            <span>Auto Start Breaks</span>
            <Checkbox
              defaultChecked={settings.auto_start_breaks}
              onChange={(value) =>
                updateSettings({
                  auto_start_breaks: value.currentTarget.checked,
                })
              }
              styles={{ icon: { color: "var(--primary-color) !important" } }}
              classNames={{
                input:
                  "border-primary checked:border-primary bg-transparent checked:bg-transparent border-2",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerSection;
