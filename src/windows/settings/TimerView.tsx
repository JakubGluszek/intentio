import React from "react";
import { Checkbox } from "@mantine/core";

import { formatTimeTimer } from "@/utils";
import { Slider } from "@/components";
import useStore from "@/store";
import ipc from "@/ipc";
import { TimerConfigForUpdate } from "@/bindings/TimerConfigForUpdate";

const TimerView: React.FC = () => {
  const store = useStore();

  const config = store.timerConfig;

  const updateConfig = async (data: Partial<TimerConfigForUpdate>) => {
    const result = await ipc.updateTimerConfig(data);
    store.setTimerConfig(result);
    return result;
  };

  React.useEffect(() => {
    ipc.getTimerConfig().then((data) => store.setTimerConfig(data));
  }, []);

  if (!config) return null;

  return (
    <div className="flex flex-col gap-3 pb-2 animate-in fade-in-0 zoom-in-95">
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-row items-center card">
          <label className="w-full" htmlFor="auto-start-pomodoros">
            Auto Start Pomodoros
          </label>
          <Checkbox
            tabIndex={-2}
            id="auto-start-pomodoros"
            size="sm"
            defaultChecked={config.auto_start_focus}
            onChange={async (value) =>
              updateConfig({
                auto_start_focus: value.currentTarget.checked,
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
        <div className="flex flex-row items-center card">
          <label className="w-full" htmlFor="auto-start-breaks">
            Auto Start Breaks
          </label>
          <Checkbox
            tabIndex={-2}
            size="sm"
            id="auto-start-breaks"
            defaultChecked={config.auto_start_breaks}
            onChange={async (value) =>
              updateConfig({
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
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-col gap-2 card">
          <div className="flex flex-row items-center justify-between">
            <span className="font-medium">Focus</span>
            <div className="bg-base rounded px-2 py-1">
              <span className="text-sm">
                {formatTimeTimer(config.focus_duration * 60)}
              </span>
            </div>
          </div>
          <Slider
            min={1}
            max={90}
            defaultValue={config.focus_duration}
            onChangeEnd={async (minutes) =>
              updateConfig({
                focus_duration: minutes,
              })
            }
          />
        </div>
        <div className="flex flex-col gap-2 card">
          <div className="flex flex-row items-center justify-between">
            <span className="text-sm font-medium">Break</span>
            <div className="bg-base rounded px-2 py-1">
              <span className="text-sm">
                {formatTimeTimer(config.break_duration * 60)}
              </span>
            </div>
          </div>
          <Slider
            min={1}
            max={25}
            defaultValue={config.break_duration}
            onChangeEnd={async (minutes) =>
              updateConfig({
                break_duration: minutes,
              })
            }
          />
        </div>
        <div className="flex flex-col gap-2 card">
          <div className="flex flex-row items-center justify-between">
            <span className="text-sm font-medium">Long Break</span>
            <div className="bg-base rounded px-2 py-1">
              <span className="text-sm">
                {formatTimeTimer(config.long_break_duration * 60)}
              </span>
            </div>
          </div>
          <Slider
            min={1}
            max={45}
            defaultValue={config.long_break_duration}
            onChangeEnd={async (minutes) =>
              updateConfig({
                long_break_duration: minutes,
              })
            }
          />
        </div>
        <div className="flex flex-col gap-2 card">
          <div className="flex flex-row items-center justify-between">
            <span className="text-sm font-medium">Long Break Interval</span>
            <div className="bg-base rounded px-2 py-1 w-[50px]">
              <div className="text-sm text-center">
                - {config.long_break_interval} -
              </div>
            </div>
          </div>
          <Slider
            min={2}
            max={16}
            defaultValue={config.long_break_interval}
            onChangeEnd={async (intervals) =>
              updateConfig({
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
