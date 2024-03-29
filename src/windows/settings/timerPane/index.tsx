import React from "react";

import { SliderCard } from "@/components";
import useStore from "@/store";
import ipc from "@/ipc";
import { Card, CheckBox, Pane, Section, SectionsWrapper, ScrollArea } from "@/ui";
import { TimerConfigForUpdate } from "@/bindings/TimerConfigForUpdate";

const TimerPane: React.FC = () => {
  const store = useStore();

  const config = store.timerConfig;

  const updateConfig = async (data: Partial<TimerConfigForUpdate>) =>
    await ipc.updateTimerConfig(data);

  React.useEffect(() => {
    ipc.getTimerConfig().then((data) => store.setTimerConfig(data));
  }, []);

  if (!config) return null;

  return (
    <Pane className="grow flex flex-col">
      <ScrollArea>
        <SectionsWrapper>
          <Section heading="Durations">
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
          </Section>

          <Section heading="Auto start">
            <Card className="flex flex-col gap-1">
              <div className="flex flex-row items-center justify-between text-sm font-semibold">
                <div>Auto Start Focus</div>
                <CheckBox
                  checked={config.auto_start_focus}
                  onChange={(auto_start_focus) =>
                    updateConfig({ auto_start_focus })
                  }
                />
              </div>
            </Card>
            <Card>
              <div className="flex flex-row items-center justify-between text-sm font-semibold">
                <div>Auto Start Breaks</div>
                <CheckBox
                  checked={config.auto_start_breaks}
                  onChange={(auto_start_breaks) =>
                    updateConfig({ auto_start_breaks })
                  }
                />
              </div>
            </Card>
          </Section>

          <Section heading="Focus session">
            <Card className="gap-1">
              <div className="flex flex-row items-center justify-between text-sm font-semibold">
                <div>Session Summary</div>
                <CheckBox
                  checked={config.session_summary}
                  onChange={(session_summary) =>
                    updateConfig({ session_summary })
                  }
                />
              </div>
              <div className="text-sm text-text/60">
                <div>
                  At the end of the session you can summarize your progress.
                </div>
              </div>
            </Card>
          </Section>

          <Section heading="Hotkeys">
            <Card className="flex flex-row items-center justify-between text-sm font-semibold">
              <div>Start/Resume</div>
              <div className="w-24 bg-darker/20 py-0.5 text-primary text-sm font-bold text-center rounded-sm shadow-inner shadow-black/20">
                CTRL + F1
              </div>
            </Card>
            <Card className="flex flex-row items-center justify-between text-sm font-semibold">
              <div>Skip</div>
              <div className="w-24 bg-darker/20 py-0.5 text-primary text-sm font-bold text-center rounded-sm shadow-inner shadow-black/20">
                CTRL + F2
              </div>
            </Card>
          </Section>
        </SectionsWrapper>
      </ScrollArea>
    </Pane>
  );
};

export default TimerPane;
