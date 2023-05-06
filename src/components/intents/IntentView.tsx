import React from "react";
import { TiPin, TiPinOutline } from "react-icons/ti";
import { BiTargetLock } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { clsx } from "@mantine/core";
import { MdDelete, MdEdit, MdTimer } from "react-icons/md";
import { HiArchive } from "react-icons/hi";

import ipc from "@/ipc";
import { useContextMenu } from "@/hooks";
import { Button, Card, ContextMenu, DangerButton, Tooltip } from "@/ui";
import { Intent } from "@/bindings/Intent";
import { EditIntent } from "./EditIntent";
import { DeleteIntentModal } from "./DeleteIntentModal";

export interface IntentViewProps {
  data: Intent;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const IntentView: React.FC<IntentViewProps> = (props) => {
  const [viewEdit, setViewEdit] = React.useState(false);
  const [viewDelete, setViewDelete] = React.useState(false);

  const [menu, onContextMenuHandler] = useContextMenu();

  if (viewEdit)
    return <EditIntent data={props.data} onExit={() => setViewEdit(false)} />;

  if (viewDelete)
    return (
      <DeleteIntentModal
        data={props.data}
        onExit={() => setViewDelete(false)}
      />
    );

  return (
    <React.Fragment>
      <Card
        className={clsx(
          props.active
            ? "bg-primary/50 hover:bg-primary/60 text-window"
            : "active:bg-primary/20"
        )}
        onClick={(e) => props.onClick?.(e)}
        onContextMenu={(e) => onContextMenuHandler(e)}
        active={props.active}
        data-tauri-disable-drag
      >
        <div className="w-full flex flex-row items-center gap-1">
          <BiTargetLock size={20} className="min-w-[20px]" />
          <div className="w-full text-left whitespace-nowrap overflow-ellipsis overflow-hidden font-black">
            {props.data.label}
          </div>
          <div
            className={clsx(
              "flex flex-row items-center gap-1",
              props.active ? "text-window" : "text-text/60"
            )}
          >
            {props.data.pinned ? (
              <TiPin size={24} className="min-w-[24px]" />
            ) : null}
            {props.data.archived_at ? (
              <HiArchive size={24} className="min-w-[24px]" />
            ) : null}
          </div>
        </div>
      </Card>

      <ContextMenu className="w-fit border-none rounded" {...menu}>
        <div className="bg-lighter/10 flex flex-row gap-0.5 rounded">
          <Tooltip label="Start session">
            <Button variant="ghost" className="rounded-l">
              <MdTimer size={20} />
            </Button>
          </Tooltip>
          <Tooltip label={props.data.pinned ? "Unpin" : "Pin"}>
            <Button
              variant="ghost"
              className="rounded-l"
              onClick={() => {
                ipc
                  .updateIntent(props.data.id, { pinned: !props.data.pinned })
                  .then((data) => {
                    toast(data.pinned ? "Pinned to top" : "Unpinned");
                  });
                menu.hide();
              }}
            >
              {props.data.pinned ? (
                <TiPin size={20} />
              ) : (
                <TiPinOutline size={20} />
              )}
            </Button>
          </Tooltip>
          <Tooltip label="Edit">
            <Button
              variant="ghost"
              onClick={() => {
                setViewEdit(true);
                menu.hide();
              }}
            >
              <MdEdit size={20} />
            </Button>
          </Tooltip>
          <Tooltip label={props.data.archived_at ? "Unarchive" : "Archive"}>
            <Button
              variant="ghost"
              onClick={() => {
                props.data.archived_at
                  ? ipc
                    .unarchiveIntent(props.data.id)
                    .then(() => toast("Intent unarchived"))
                  : ipc
                    .archiveIntent(props.data.id)
                    .then(() => toast("Intent archived"));
                menu.hide();
              }}
            >
              <HiArchive size={20} />
            </Button>
          </Tooltip>
          <Tooltip label="Delete" className="text-danger">
            <DangerButton
              variant="ghost"
              className="rounded-r"
              onClick={() => {
                setViewDelete(true);
                menu.hide();
              }}
            >
              <MdDelete size={20} />
            </DangerButton>
          </Tooltip>
        </div>
      </ContextMenu>
    </React.Fragment>
  );
};
