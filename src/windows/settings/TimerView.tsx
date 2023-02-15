import React from "react";
import { Checkbox } from "@mantine/core";

import { formatTimeTimer } from "@/utils";
import { Settings } from "@/bindings/Settings";
import { Slider } from "@/components";
import { SettingsForUpdate } from "@/bindings/SettingsForUpdate";

interface Props {
  settings: Settings;
  update: (data: Partial<SettingsForUpdate>) => Promise<Settings>;
}

const TimerView: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="flex flex-row items-center justify-between rounded">
        <label htmlFor="auto-start-pomodoros">Auto Start Pomodoros</label>
        <Checkbox
          tabIndex={-2}
          id="auto-start-pomodoros"
          size="sm"
          defaultChecked={props.settings.auto_start_pomodoros}
          onChange={(value) =>
            props.update({
              auto_start_pomodoros: value.currentTarget.checked,
            })
          }
          styles={{
            icon: { color: "rgb(var(--primary-color)) !important" },
            root: { height: "20px" },
          }}
          classNames={{
            input:
              "border-primary checked:border-primary bg-transparent checked:bg-transparent border-2",
          }}
        />
      </div>
      <div className="flex flex-row items-center justify-between rounded">
        <label htmlFor="auto-start-breaks">Auto Start Breaks</label>
        <Checkbox
          tabIndex={-2}
          size="sm"
          id="auto-start-breaks"
          defaultChecked={props.settings.auto_start_breaks}
          onChange={(value) =>
            props.update({
              auto_start_breaks: value.currentTarget.checked,
            })
          }
          styles={{
            icon: { color: "rgb(var(--primary-color)) !important" },
            root: { height: "20px" },
          }}
          classNames={{
            input:
              "border-primary checked:border-primary bg-transparent checked:bg-transparent border-2",
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 p-2 bg-window rounded shadow">
          <div className="flex flex-row items-center justify-between">
            <span className="font-medium">Focus</span>
            <div className="bg-base rounded px-2 py-1">
              <span className="text-sm">
                {formatTimeTimer(props.settings.pomodoro_duration * 60)}
              </span>
            </div>
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
        <div className="flex flex-col gap-2 p-2 bg-window rounded shadow">
          <div className="flex flex-row items-center justify-between">
            <span className="text-sm font-medium">Break</span>
            <div className="bg-base rounded px-2 py-1">
              <span className="text-sm">
                {formatTimeTimer(props.settings.break_duration * 60)}
              </span>
            </div>
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
        <div className="flex flex-col gap-2 p-2 bg-window rounded shadow">
          <div className="flex flex-row items-center justify-between">
            <span className="text-sm font-medium">Long Break</span>
            <div className="bg-base rounded px-2 py-1">
              <span className="text-sm">
                {formatTimeTimer(props.settings.long_break_duration * 60)}
              </span>
            </div>
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
        <div className="flex flex-col gap-2 p-2 bg-window rounded shadow">
          <div className="flex flex-row items-center justify-between">
            <span className="text-sm font-medium">Long Break Interval</span>
            <div className="bg-base rounded px-2 py-1 w-[50px]">
              <div className="text-sm text-center">
                - {props.settings.long_break_interval} -
              </div>
            </div>
          </div>
          <Slider
            min={2}
            max={16}
            defaultValue={props.settings.long_break_interval}
            onChangeEnd={(intervals) =>
              props.update({
                long_break_interval: intervals,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default TimerView;
