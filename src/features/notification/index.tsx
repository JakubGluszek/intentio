import React from "react";
import { MdClose } from "react-icons/md";

import { Button, IconView } from "@/ui";

import { Notification } from "./types";

export interface NotificationProps extends Notification {
  onClose: () => void;
}

export const NotificationView: React.FC<NotificationProps> = (props) => {
  return (
    <div className="relative w-[24rem] h-[2.5rem] flex flex-row gap-0.5 p-0.5 bg-window/95 rounded border-2 border-base/5">
      <div className="grow flex flex-row items-center gap-1 p-1 bg-base/5">
        <IconView icon={props.icon} scale={0.9} />
        <span className="text-sm">{props.message}</span>
      </div>
      <div className="flex flex-row items-center p-1 bg-base/5">
        <Button variant="ghost" onClick={props.onClose}>
          <IconView icon={MdClose} />
        </Button>
      </div>
    </div>
  );
};
