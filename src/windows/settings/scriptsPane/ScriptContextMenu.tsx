import React from "react";
import { VscDebugStart, VscEdit, VscSymbolEvent } from "react-icons/vsc";
import { MdDelete } from "react-icons/md";

import ipc from "@/ipc";
import { Script } from "@/bindings/Script";
import { useConfirmDelete } from "@/hooks";
import { MenuPosition } from "@/hooks/useContextMenu";
import { Button, ContextMenu, DangerButton } from "@/ui";

interface ScriptContextMenuProps {
  display: boolean;
  data: Script;
  position?: MenuPosition;
  hide: () => void;
  runScript: () => void;
  viewCode: () => void;
  viewEvents: () => void;
}

const ScriptContextMenu: React.FC<ScriptContextMenuProps> = (props) => {
  const { viewConfirmDelete, onDelete } = useConfirmDelete(() =>
    ipc.deleteScript(props.data.id)
  );

  return (
    <ContextMenu {...props}>
      <div className="flex flex-col gap-0.5 w-28">
        <Button
          onClick={() => {
            props.runScript();
            props.hide();
          }}
          variant="base"
        >
          <div className="w-fit">
            <VscDebugStart size={20} />
          </div>
          <div className="w-full">Run</div>
        </Button>
        <Button onClick={() => props.viewCode()} variant="base">
          <div className="w-fit">
            <VscEdit size={20} />
          </div>
          <div className="w-full">Edit</div>
        </Button>
        <Button onClick={() => props.viewEvents()} variant="base">
          <div className="w-fit">
            <VscSymbolEvent size={20} />
          </div>
          <div className="w-full">Events</div>
        </Button>
        <DangerButton onClick={() => onDelete()} variant="base">
          <div className="w-fit">
            <MdDelete size={20} />
          </div>
          <div className="w-full">
            {viewConfirmDelete ? "Confirm" : "Delete"}
          </div>
        </DangerButton>
      </div>
    </ContextMenu>
  );
};

export default ScriptContextMenu;
