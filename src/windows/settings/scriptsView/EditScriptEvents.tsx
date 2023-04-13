import React from "react";
import { Checkbox } from "@mantine/core";

import utils from "@/utils";
import ipc from "@/ipc";
import useStore from "@/store";
import { Script } from "@/bindings/Script";
import { ScriptForUpdate } from "@/bindings/ScriptForUpdate";
import { Button } from "@/components";

interface Props {
  data: Script;
  onExit: () => void;
}

const EditScriptEvents: React.FC<Props> = (props) => {
  const store = useStore();

  const handleUpdate = (data: Partial<ScriptForUpdate>) =>
    ipc.updateScript(props.data.id, data).then((data) => {
      store.patchScript(props.data.id, data);
    });

  return (
    <div className="grow flex flex-col justify-between gap-2 p-1.5 window bg-window rounded-b">
      <div className="text-lg font-black text-primary/80">
        {props.data.label}
      </div>
      <div className="flex flex-col gap-1.5">
        {Object.entries(props.data)
          .slice(4, 10)
          .reverse()
          .map(([key, value]: [string, boolean]) => (
            <div
              key={key}
              className="flex flex-row items-center justify-between bg-base/50 border-2 border-base rounded-sm shadow p-0.5 px-1.5"
            >
              <label className="w-full" htmlFor={key}>
                {utils.capitalize(key.replaceAll("_", " "))}
              </label>
              <Checkbox
                tabIndex={-2}
                id={key}
                size="sm"
                defaultChecked={value}
                onChange={(value) =>
                  handleUpdate({
                    [key]: value.currentTarget.checked,
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
          ))}
      </div>
      <Button onClick={() => props.onExit()} style={{ height: 32 }}>
        Exit
      </Button>
    </div>
  );
};

export default EditScriptEvents;
