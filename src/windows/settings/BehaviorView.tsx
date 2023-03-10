import React from "react";
import { Checkbox } from "@mantine/core";
import useStore from "@/store";
import ipc from "@/ipc";
import { BehaviorConfigForUpdate } from "@/bindings/BehaviorConfigForUpdate";

const BehaviorView: React.FC = () => {
  const store = useStore();
  const config = store.behaviorConfig;

  const updateConfig = async (data: Partial<BehaviorConfigForUpdate>) => {
    const result = await ipc.updateBehaviorConfig(data);
    store.setBehaviorConfig(result);
    return result;
  };

  React.useEffect(() => {
    ipc.getBehaviorConfig().then((data) => store.setBehaviorConfig(data));
  }, []);

  if (!config) return null;

  return (
    <div className="flex flex-col gap-3 pb-2 animate-in fade-in-0 zoom-in-95">
      {/* Display live countdown checkbox */}
      <div className="flex flex-row items-center card">
        <label className="w-full text-sm text-text/80" htmlFor="hide-to-tray">
          Minimize main window to tray
        </label>
        <Checkbox
          tabIndex={-2}
          id="hide-to-tray"
          size="sm"
          defaultChecked={config.main_minimize_to_tray}
          onChange={(value) =>
            updateConfig({
              main_minimize_to_tray: value.currentTarget.checked,
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
  );
};

export default BehaviorView;
