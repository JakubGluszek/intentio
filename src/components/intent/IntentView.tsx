import React from "react";
import { TiPin, TiPinOutline } from "react-icons/ti";
import { BiTargetLock } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { clsx } from "@mantine/core";
import { MdEdit } from "react-icons/md";
import { RiArchiveFill } from "react-icons/ri";
import { motion } from "framer-motion";

import ipc from "@/ipc";
import { useContextMenu } from "@/hooks";
import { Button, Card, ContextMenu, Tooltip } from "@/ui";
import { Intent } from "@/bindings/Intent";

import { EditIntent } from "./EditIntent";

export interface IntentViewProps {
  data: Intent;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const IntentView = React.forwardRef<HTMLDivElement, IntentViewProps>(
  (props, ref) => {
    const [viewEdit, setViewEdit] = React.useState(false);

    const [menu, onContextMenuHandler] = useContextMenu();

    if (viewEdit)
      return <EditIntent data={props.data} onExit={() => setViewEdit(false)} />;

    return (
      <>
        <motion.div
          ref={ref}
          layout
          transition={{ duration: 0.3, type: "spring" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <Card
            className={clsx(
              "p-1 cursor-pointer",
              props.active
                ? "bg-primary/50 border-transparent hover:bg-primary/60 hover:border-transparent active:bg-primary/70 active:border-transparent text-window"
                : "hover:border-primary/50 hover:text-primary",
              menu.display &&
              !props.active &&
              "border-primary/50 text-primary/80"
            )}
            onClick={(e) => props.onClick?.(e)}
            onContextMenu={(e) => onContextMenuHandler(e)}
            data-tauri-disable-drag
          >
            <div className="w-full flex flex-row items-center gap-1.5">
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
                  <TiPin size={20} className="min-w-[24px]" />
                ) : null}
                {props.data.archived_at ? (
                  <RiArchiveFill size={20} className="min-w-[24px]" />
                ) : null}
              </div>
            </div>
          </Card>
        </motion.div>

        <ContextMenu
          className="z-10 w-fit border-b-2 bg-window border-base/80 rounded"
          {...menu}
        >
          <div className="bg-lighter/10 flex flex-row gap-0.5 rounded overflow-clip">
            <Tooltip label={props.data.pinned ? "Unpin" : "Pin"}>
              <Button
                variant="ghost"
                className="rounded-none"
                onClick={() => {
                  ipc.updateIntent(props.data.id, {
                    pinned: !props.data.pinned,
                  });
                  toast(!props.data.pinned ? "Pinned to top" : "Unpinned");
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
                className="rounded-none"
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
                className="rounded-none"
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
                <RiArchiveFill size={20} />
              </Button>
            </Tooltip>
          </div>
        </ContextMenu>
      </>
    );
  }
);
