import React from "react";

import { Settings } from "@/bindings/Settings";
import { SettingsForUpdate } from "@/bindings/SettingsForUpdate";
import { Checkbox } from "@mantine/core";

interface Props {
  settings: Settings;
  update: (data: Partial<SettingsForUpdate>) => Promise<Settings>;
}

const BehaviorView: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col gap-2 p-2">
      {/* Display live countdown checkbox */}
      <div className="flex flex-row items-center justify-between rounded">
        <label htmlFor="hide-to-tray">Hide to tray</label>
        <Checkbox
          tabIndex={-2}
          id="hide-to-tray"
          size="sm"
          defaultChecked={props.settings.main_window_to_tray}
          onChange={(value) =>
            props.update({
              main_window_to_tray: value.currentTarget.checked,
            })
          }
          styles={{
            icon: { color: "var(--primary-color) !important" },
            root: { height: "20px" },
          }}
          classNames={{
            input:
              "border-primary checked:border-primary bg-transparent checked:bg-transparent border-2",
          }}
        />
      </div>
      <div>Always on top: false / true</div>
      <div>
        Scripts (display log, maybe) (display only on supported systems) (test)
      </div>
      <div>Auto start app</div>
    </div>
  );
};

export default BehaviorView;
