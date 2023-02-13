import React from "react";
import { useClickOutside } from "@mantine/hooks";
import { toast } from "react-hot-toast";

import { Script } from "@/bindings/Script";
import { Button } from "@/components";
import services from "@/services";
import useStore from "@/store";

interface ScriptContextMenuProps {
  data: Script;
  x: number;
  y: number;
  width: number;
  height: number;
  hide: () => void;
  runScript: () => void;
  viewCode: () => void;
  viewEvents: () => void;
}

const ScriptContextMenu: React.FC<ScriptContextMenuProps> = (props) => {
  const [preventHide, setPreventHide] = React.useState(true);
  const [viewConfirmDelete, setViewConfirmDelete] = React.useState(false);
  const [deleteBtn, setDeleteBtn] = React.useState<HTMLButtonElement | null>(
    null
  );

  const store = useStore();

  const ref = useClickOutside<HTMLDivElement>(
    () => !preventHide && props.hide(),
    ["click", "contextmenu"],
    [deleteBtn]
  );

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

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setPreventHide(false);
    }, 20);

    return () => clearTimeout(timeout);
  }, []);

  React.useEffect(() => {
    store.setTauriDragEnabled(false);
    return () => store.setTauriDragEnabled(true);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        zIndex: 9999,
        position: "fixed",
        left: props.x,
        top: props.y,
        width: props.width,
        height: props.height,
      }}
      className="bg-base rounded shadow-lg text-sm p-0.5"
    >
      <div className="flex flex-col gap-0.5 overflow-clip rounded">
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
            // @ts-ignore
            innerRef={setDeleteBtn}
            onClick={() => setViewConfirmDelete(true)}
            rounded={false}
            color="danger"
          >
            <div className="w-full">Delete</div>
          </Button>
        ) : (
          <Button
            onClick={() =>
              services.deleteScript(props.data.id).then((data) => {
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
    </div>
  );
};

export default ScriptContextMenu;
