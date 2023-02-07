import React from "react";
import { Checkbox } from "@mantine/core";

import { Settings } from "@/bindings/Settings";
import { SettingsForUpdate } from "@/bindings/SettingsForUpdate";

interface Props {
  settings: Settings;
  update: (data: Partial<SettingsForUpdate>) => Promise<Settings>;
}

const BehaviorView: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Display live countdown checkbox */}
      <div className="flex flex-row items-center justify-between rounded p-2 bg-window">
        <label htmlFor="hide-to-tray">Hide main window to tray</label>
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
      <div className="flex flex-col">
        <div className="text-lg tracking-widest font-bold">Scripts</div>
      </div>
    </div>
  );
};

export default BehaviorView;
