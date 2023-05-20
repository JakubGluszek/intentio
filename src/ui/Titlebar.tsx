import React from "react";
import { MdClose } from "react-icons/md";
import { IconType } from "react-icons";
import { appWindow } from "@tauri-apps/api/window";

import { Button, Pane } from "@/ui";

interface TitlebarProps {
  icon: IconType;
  title: string;
}

export const Titlebar: React.FC<TitlebarProps> = (props) => {
  return (
    <Pane className="flex flex-row items-center justify-between p-0">
      <div className="flex flex-row items-center gap-1 text-text pl-1">
        <props.icon size={20} />
        <span className="font-semibold">{props.title}</span>
      </div>
      <Button
        onClick={() => appWindow.close()}
        variant="ghost"
        className="rounded-none"
      >
        <MdClose size={24} />
      </Button>
    </Pane>
  );
};