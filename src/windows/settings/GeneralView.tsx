import React from "react";

import { Card, Pane } from "@/ui";
import { CheckboxCard } from "@/components";
import ipc from "@/ipc";
import useStore from "@/store";

const GeneralView: React.FC = () => {
  const store = useStore();

  React.useEffect(() => {
    ipc.getBehaviorConfig().then((data) => store.setBehaviorConfig(data));
  }, []);

  if (!store.behaviorConfig) return null;

  return (
    <Pane className="grow flex flex-col overflow-y-auto">
      <div className="max-h-0 overflow-y">
        <div className="flex flex-col gap-2 pb-1.5">
          <div className="flex flex-col gap-1">
            <h2>Alerts</h2>
            <CheckboxCard
              label="System notifications"
              value={store.behaviorConfig.system_notifications}
              onChange={(system_notifications) =>
                ipc.updateBehaviorConfig({ system_notifications })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <h2>Main window</h2>
            <CheckboxCard
              label="Minimize to tray"
              value={store.behaviorConfig.main_minimize_to_tray}
              onChange={(main_minimize_to_tray) =>
                ipc.updateBehaviorConfig({ main_minimize_to_tray })
              }
            />
          </div>
          <HotkeysSection />
        </div>
      </div>
    </Pane>
  );
};

const HotkeysSection: React.FC = () => {
  return (
    <div className="flex flex-col gap-1">
      <h2>Hotkeys</h2>
      <Card className="flex flex-row items-center justify-between">
        <div>
          <span className="text-primary/80 font-semibold">Timer</span> -
          Start/Resume
        </div>
        <div className="w-12 p-1 bg-base/40 text-center rounded-sm shadow-inner shadow-black/20">
          F1
        </div>
      </Card>
      <Card className="flex flex-row items-center justify-between">
        <div>
          <span className="text-primary/80 font-semibold">Timer</span> - Skip
        </div>
        <div className="w-12 p-1 bg-base/40 text-center rounded-sm shadow-inner shadow-black/20">
          F2
        </div>
      </Card>
    </div>
  );
};

export default GeneralView;
