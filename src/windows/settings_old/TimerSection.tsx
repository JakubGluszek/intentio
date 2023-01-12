import React from "react";
import { MdTimer } from "react-icons/md";
import { Checkbox } from "@mantine/core";

import { formatTimeTimer } from "../../utils";
import { Slider } from "../../components";
import { Settings } from "../../bindings/Settings";
import { updateSettings } from "@/app/services";
import { SettingsForUpdate } from "@/bindings/SettingsForUpdate";

interface Props {
  settings: Settings;
  update: (data: Partial<SettingsForUpdate>) => Promise<Settings>;
}

const TimerSection: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-center gap-2">
        <MdTimer size={32} />
        <span className="text-xl">Timer</span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="group card flex flex-col items-center gap-2">
            <span className="font-medium">Focus</span>
            <div className="bg-base group-hover:bg-window rounded px-2 py-1">
              <span className="text-sm">
                {formatTimeTimer(props.settings.pomodoro_duration * 60)}
              </span>
            </div>
            <Slider
              min={1}
              max={90}
              defaultValue={props.settings.pomodoro_duration}
              onChangeEnd={(minutes) =>
                props.update({
                  pomodoro_duration: minutes,
                })
              }
            />
          </div>
          <div className="group card flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Break</span>
            <div className="group-hover:bg-window bg-base rounded px-2 py-1">
              <span className="text-sm">
                {formatTimeTimer(props.settings.break_duration * 60)}
              </span>
            </div>
            <Slider
              min={1}
              max={25}
              defaultValue={props.settings.break_duration}
              onChangeEnd={(minutes) =>
                props.update({
                  break_duration: minutes,
                })
              }
            />
          </div>
          <div className="group card flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Long Break</span>
            <div className="bg-base group-hover:bg-window rounded px-2 py-1">
              <span className="text-sm">
                {formatTimeTimer(props.settings.long_break_duration * 60)}
              </span>
            </div>
            <Slider
              min={1}
              max={45}
              defaultValue={props.settings.long_break_duration}
              onChangeEnd={(minutes) =>
                props.update({
                  long_break_duration: minutes,
                })
              }
            />
          </div>
          <div className="group card flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Long Break Interval</span>
            <div className="bg-base group-hover:bg-window rounded px-2 py-1">
              <span className="text-sm">
                {props.settings.long_break_interval}
              </span>
            </div>
            <Slider
              min={2}
              max={16}
              defaultValue={props.settings.long_break_interval}
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
            <label htmlFor="auto-start-pomodoros">Auto Start Pomodoros</label>
            <Checkbox
              id="auto-start-pomodoros"
              size="md"
              defaultChecked={props.settings.auto_start_pomodoros}
              onChange={(value) =>
                props.update({
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
            <label htmlFor="auto-start-breaks">Auto Start Breaks</label>
            <Checkbox
              size="md"
              id="auto-start-breaks"
              defaultChecked={props.settings.auto_start_breaks}
              onChange={(value) =>
                props.update({
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
