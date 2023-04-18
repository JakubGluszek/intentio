import React from "react";

import { formatTimeTimer } from "@/utils";
import { BooleanView, Slider } from "@/components";
import useStore from "@/store";
import ipc from "@/ipc";
import { TimerConfigForUpdate } from "@/bindings/TimerConfigForUpdate";
import { Pane } from "@/ui";

const TimerView: React.FC = () => {
  const store = useStore();

  const config = store.timerConfig;

  const updateConfig = async (data: Partial<TimerConfigForUpdate>) =>
    await ipc.updateTimerConfig(data);

  React.useEffect(() => {
    ipc.getTimerConfig().then((data) => store.setTimerConfig(data));
  }, []);

  if (!config) return null;

  return (
    <Pane className="grow flex flex-col overflow-y-auto">
      <div className="max-h-0 overflow-y">
        <div className="flex flex-col gap-1 pb-1.5">
          <BooleanView
            label="Auto Start Focus"
            checked={config.auto_start_focus}
            onChange={(value) =>
              updateConfig({
                auto_start_focus: value,
              })
            }
          />
          <BooleanView
            label="Auto Start Breaks"
            checked={config.auto_start_breaks}
            onChange={(value) =>
              updateConfig({
                auto_start_breaks: value,
              })
            }
          />
          <SliderView
            type="duration"
            label="Focus"
            digit={config.focus_duration}
            minDigit={1}
            maxDigit={90}
            onChange={(minutes) => updateConfig({ focus_duration: minutes })}
          />
          <SliderView
            type="duration"
            label="Break"
            digit={config.break_duration}
            minDigit={1}
            maxDigit={45}
            onChange={(minutes) => updateConfig({ break_duration: minutes })}
          />
          <SliderView
            type="duration"
            label="Long Break"
            digit={config.long_break_duration}
            minDigit={1}
            maxDigit={45}
            onChange={(minutes) =>
              updateConfig({ long_break_duration: minutes })
            }
          />
          <SliderView
            type="iterations"
            label="Long Break Interval"
            digit={config.long_break_interval}
            minDigit={2}
            maxDigit={16}
            onChange={(interval) =>
              updateConfig({ long_break_interval: interval })
            }
          />
        </div>
      </div>
    </Pane>
  );
};

interface SliderViewProps {
  type: "duration" | "iterations";
  label: string;
  digit: number;
  minDigit: number;
  maxDigit: number;
  onChange: (minutes: number) => void;
}

const SliderView: React.FC<SliderViewProps> = (props) => {
  const content =
    props.type === "duration" ? formatTimeTimer(props.digit * 60) : props.digit;

  return (
    <div className="flex flex-col gap-2 card p-1.5">
      <div className="flex flex-row items-center justify-between">
        <span className="font-medium">{props.label}</span>
        <div className="w-16 bg-window border-2 border-base rounded-sm py-0.5">
          <div className="text-sm text-center">{content}</div>
        </div>
      </div>
      <Slider
        min={props.minDigit}
        max={props.maxDigit}
        defaultValue={props.digit}
        onChangeEnd={(value) => props.onChange(value)}
      />
    </div>
  );
};

export default TimerView;
