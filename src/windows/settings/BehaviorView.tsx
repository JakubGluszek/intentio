import React from "react";

import { Settings } from "@/bindings/Settings";
import { SettingsForUpdate } from "@/bindings/SettingsForUpdate";

interface Props {
  settings: Settings;
  update: (data: Partial<SettingsForUpdate>) => Promise<Settings>;
}

const BehaviorView: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col gap-2 p-2">
      <div>Main window: minimize / to tray</div>
      <div>Always on top: false / true</div>
      <div>
        Scripts (display log, maybe) (display only on supported systems) (test)
      </div>
      <div>Auto start app</div>
    </div>
  );
};

export default BehaviorView;
