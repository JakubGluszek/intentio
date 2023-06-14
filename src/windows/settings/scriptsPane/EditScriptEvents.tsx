import React from "react";
import { Checkbox } from "@mantine/core";

import utils from "@/utils";
import ipc from "@/ipc";
import { Script } from "@/bindings/Script";
import { Button, Card, Pane } from "@/ui";
import { UpdateScript } from "@/bindings/UpdateScript";

interface Props {
  data: Script;
  onExit: () => void;
}

const EditScriptEvents: React.FC<Props> = (props) => {
  const handleUpdate = (data: Partial<UpdateScript>) =>
    ipc.updateScript(props.data.id, data);

  return (
    <Pane className="grow flex flex-col justify-between gap-1">
      <div className="text-lg font-black text-primary/80">
        {props.data.label}
      </div>
      <div className="flex flex-col gap-1">
        {Object.entries(props.data)
          .slice(4, 10)
          .reverse()
          .map(([key, value]: [string, boolean]) => (
            <Card
              key={key}
              className="flex flex-row items-center justify-between py-1"
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
            </Card>
          ))}
      </div>
      <Button variant="base" onClick={() => props.onExit()}>
        Exit
      </Button>
    </Pane>
  );
};

export default EditScriptEvents;
