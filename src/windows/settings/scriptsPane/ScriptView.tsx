import React from "react";
import { MdCircle } from "react-icons/md";
import { clsx } from "@mantine/core";

import ipc from "@/ipc";
import utils from "@/utils";
import { useContextMenu } from "@/hooks";
import { Script } from "@/bindings/Script";
import { Card, Tooltip } from "@/ui";
import ScriptContextMenu from "./ScriptContextMenu";
import { UpdateScript } from "@/bindings/UpdateScript";

interface ScriptView {
  data: Script;
  onEdit: () => void;
  onEditEvents: () => void;
}

const ScriptView: React.FC<ScriptView> = (props) => {
  const [menu, onContextMenuHandler] = useContextMenu();

  const handleUpdate = async (data: Partial<UpdateScript>) =>
    await ipc.updateScript(props.data.id, data);

  return (
    <Card onContextMenu={onContextMenuHandler}>
      <div className="w-full flex flex-row items-center gap-2">
        <Tooltip label={props.data.enabled ? "Active" : "Disabled"}>
          <button
            className={clsx(
              "pt-0.5",
              props.data.enabled ? "text-green-500" : "text-red-500"
            )}
            onClick={() => handleUpdate({ enabled: !props.data.enabled })}
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
