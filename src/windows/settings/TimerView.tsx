import React from "react";

import { SliderCard } from "@/components";
import useStore from "@/store";
import ipc from "@/ipc";
import { Pane } from "@/ui";
import { CheckboxCard } from "@/components";
import { TimerConfigForUpdate } from "@/bindings/TimerConfigForUpdate";

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
          <CheckboxCard
            label="Auto Start Focus"
            value={config.auto_start_focus}
            onChange={(value) =>
              updateConfig({
                auto_start_focus: value,
              })
            }
          />
          <CheckboxCard
            label="Auto Start Breaks"
            value={config.auto_start_breaks}
            onChange={(value) =>
              updateConfig({
                auto_start_breaks: value,
              })
            }
          />
          <SliderCard
            type="duration"
            label="Focus"
            digit={config.focus_duration}
            minDigit={1}
            maxDigit={90}
            onChange={(minutes) => updateConfig({ focus_duration: minutes })}
          />
          <SliderCard
            type="duration"
            label="Break"
            digit={config.break_duration}
            minDigit={1}
            maxDigit={45}
            onChange={(minutes) => updateConfig({ break_duration: minutes })}
          />
          <SliderCard
            type="duration"
            label="Long Break"
            digit={config.long_break_duration}
            minDigit={1}
            maxDigit={45}
            onChange={(minutes) =>
              updateConfig({ long_break_duration: minutes })
            }
          />
          <SliderCard
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

export default TimerView;
