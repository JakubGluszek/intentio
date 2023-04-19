import React from "react";
import { MdCircle } from "react-icons/md";
import { clsx } from "@mantine/core";

import ipc from "@/ipc";
import useStore from "@/store";
import utils from "@/utils";
import { useContextMenu } from "@/hooks";
import { Script } from "@/bindings/Script";
import { ScriptForUpdate } from "@/bindings/ScriptForUpdate";
import ScriptContextMenu from "./ScriptContextMenu";
import { Card, Tooltip } from "@/ui";

interface ScriptView {
  data: Script;
  onEdit: () => void;
  onEditEvents: () => void;
}

const ScriptView: React.FC<ScriptView> = (props) => {
  const [menu, onContextMenuHandler] = useContextMenu();

  const store = useStore();

  const handleUpdate = async (data: Partial<ScriptForUpdate>) =>
    await ipc
      .updateScript(props.data.id, data)
      .then((data) => store.patchScript(props.data.id, data));

  return (
    <Card onContextMenu={onContextMenuHandler}>
      <div className="w-full flex flex-row items-center gap-2">
        <Tooltip label={props.data.active ? "Active" : "Disabled"}>
          <button
            className={clsx(
              "pt-0.5",
              props.data.active ? "text-green-500" : "text-red-500"
            )}
            onClick={() => handleUpdate({ active: !props.data.active })}
          >
            <MdCircle size={16} />
          </button>
        </Tooltip>

        <div>{props.data.label}</div>
      </div>

      <ScriptContextMenu
        {...menu}
        data={props.data}
        viewCode={() => props.onEdit()}
        viewEvents={() => props.onEditEvents()}
        runScript={() => utils.executeScript(props.data.body)}
      />
    </Card>
  );
};

export default ScriptView;
