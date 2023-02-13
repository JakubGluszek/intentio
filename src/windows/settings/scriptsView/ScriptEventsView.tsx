import React from "react";
import { Checkbox } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";

import utils from "@/utils";
import { Script } from "@/bindings/Script";
import { ScriptForUpdate } from "@/bindings/ScriptForUpdate";

interface Props {
  data: Script;
  onUpdate: (data: Partial<ScriptForUpdate>) => void;
  exit: () => void;
}

const ScriptEventsView: React.FC<Props> = (props) => {
  const ref = useClickOutside(() => props.exit());

  return (
    <div
      ref={ref}
      className="flex flex-col gap-2 p-1.5 bg-window rounded shadow"
    >
      {Object.entries(props.data)
        .slice(4, 10)
        .reverse()
        .map(([key, value]: [string, boolean]) => (
          <div key={key} className="flex flex-row items-center justify-between">
            <label className="w-full" htmlFor={key}>
              {utils.capitalize(key.replaceAll("_", " "))}
            </label>
            <Checkbox
              tabIndex={-2}
              id={key}
              size="sm"
              defaultChecked={value}
              onChange={(value) =>
                props.onUpdate({
                  [key]: value.currentTarget.checked,
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
        ))}
    </div>
  );
};

export default ScriptEventsView;
