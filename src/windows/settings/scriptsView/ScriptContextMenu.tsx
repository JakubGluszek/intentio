import React from "react";
import { toast } from "react-hot-toast";

import ipc from "@/ipc";
import useStore from "@/store";
import { Button, ContextMenu } from "@/components";
import { Script } from "@/bindings/Script";

interface ScriptContextMenuProps {
  data: Script;
  leftPosition: number;
  topPosition: number;
  hide: () => void;
  runScript: () => void;
  viewCode: () => void;
  viewEvents: () => void;
}

const ScriptContextMenu: React.FC<ScriptContextMenuProps> = (props) => {
  const [viewConfirmDelete, setViewConfirmDelete] = React.useState(false);

  const store = useStore();

  React.useEffect(() => {
    let hideConfirm: NodeJS.Timeout | undefined;
    if (viewConfirmDelete) {
      hideConfirm = setTimeout(() => {
        setViewConfirmDelete(false);
      }, 3000);
    } else {
      hideConfirm && clearTimeout(hideConfirm);
    }

    return () => hideConfirm && clearTimeout(hideConfirm);
  }, [viewConfirmDelete]);

  return (
    <ContextMenu {...props}>
      <div className="w-24 flex flex-col gap-0.5">
        <Button onClick={() => props.runScript()} rounded={false}>
          Run
        </Button>
        <Button onClick={() => props.viewCode()} rounded={false}>
          Code
        </Button>
        <Button onClick={() => props.viewEvents()} rounded={false}>
          Events
        </Button>
        {!viewConfirmDelete ? (
          <Button
            onClick={() => setViewConfirmDelete(true)}
            rounded={false}
            color="danger"
          >
            <div className="w-full">Delete</div>
          </Button>
        ) : (
          <Button
            onClick={() =>
              ipc.deleteScript(props.data.id).then((data) => {
                store.removeScript(data.id);
                toast("Script deleted");
              })
            }
            rounded={false}
            color="danger"
          >
            Confirm
          </Button>
        )}
      </div>
    </ContextMenu>
  );
};

export default ScriptContextMenu;
