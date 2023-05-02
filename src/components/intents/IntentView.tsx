import React from "react";
import { TiPin, TiPinOutline } from "react-icons/ti";
import { BiArchive, BiTargetLock } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { clsx } from "@mantine/core";

import ipc from "@/ipc";
import { useContextMenu } from "@/hooks";
import { Button, Card, ContextMenu, DangerButton, Tooltip } from "@/ui";
import { Intent } from "@/bindings/Intent";
import { MdArchive, MdDelete, MdEdit } from "react-icons/md";
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
          "p-1",
          menu.display &&
          "bg-primary/10 hover:bg-primary/10 hover:border-primary/60 text-base"
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
              props.active ? "text-primary/80" : "text-text/80"
            )}
          >
            {props.data.pinned ? (
              <TiPin size={24} className="min-w-[24px]" />
            ) : null}
            {props.data.archived_at ? (
              <BiArchive size={24} className="min-w-[24px]" />
            ) : null}
          </div>
        </div>
      </Card>

      <ContextMenu
        className="w-fit h-fit flex flex-row border-base/40 hover:border-primary/60"
        {...menu}
      >
        <Tooltip label={props.data.pinned ? "Unpin" : "Pin"}>
          <Button
            variant="ghost"
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
                  .then(() => toast("Intent removed from the archive"))
                : ipc
                  .archiveIntent(props.data.id)
                  .then(() => toast("Intent saved to archive"));
              menu.hide();
            }}
          >
            <MdArchive size={20} />
          </Button>
        </Tooltip>
        <Tooltip label="Delete">
          <DangerButton
            variant="ghost"
            onClick={() => {
              setViewDelete(true);
              menu.hide();
            }}
          >
            <MdDelete size={20} />
          </DangerButton>
        </Tooltip>
      </ContextMenu>
    </React.Fragment>
  );
};
