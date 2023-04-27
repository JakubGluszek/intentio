import React from "react";
import { TiPin, TiPinOutline } from "react-icons/ti";
import { BiArchive, BiTargetLock } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { clsx } from "@mantine/core";

import ipc from "@/ipc";
import { useContextMenu } from "@/hooks";
import { Button, Card, ContextMenu } from "@/ui";
import { Intent } from "@/bindings/Intent";

export interface IntentViewProps {
  data: Intent;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const IntentView: React.FC<IntentViewProps> = (props) => {
  const { data } = props;

  const [menu, onContextMenuHandler] = useContextMenu();

  return (
    <React.Fragment>
      <Card
        onClick={(e) => props.onClick?.(e)}
        onContextMenu={onContextMenuHandler}
        active={props.active}
        data-tauri-disable-drag
      >
        <div className="w-full flex flex-row items-center gap-1">
          <BiTargetLock size={20} className="min-w-[20px]" />
          <div className="w-full text-left whitespace-nowrap overflow-ellipsis overflow-hidden font-black">
            {data.label}
          </div>
          <div
            className={clsx(
              "flex flex-row items-center gap-1",
              props.active ? "text-primary/80" : "text-text/80"
            )}
          >
            {data.pinned ? <TiPin size={24} className="min-w-[24px]" /> : null}
            {data.archived_at ? (
              <BiArchive size={24} className="min-w-[24px]" />
            ) : null}
          </div>
        </div>
      </Card>

      <ContextMenu {...menu}>
        <Button
          variant="base"
          className="w-full"
          onClick={() =>
            ipc
              .updateIntent(props.data.id, { pinned: !props.data.pinned })
              .then((data) => {
                menu.hide();
                toast(data.pinned ? "Pinned to top" : "Unpinned");
              })
          }
        >
          <div className="w-fit">
            {props.data.pinned ? (
              <TiPin size={20} />
            ) : (
              <TiPinOutline size={20} />
            )}
          </div>
          <div className="w-full">{props.data.pinned ? "Unpin" : "Pin"}</div>
        </Button>
      </ContextMenu>
    </React.Fragment>
  );
};
