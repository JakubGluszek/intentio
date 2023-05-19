import React from "react";
import { MdClose } from "react-icons/md";
import { appWindow } from "@tauri-apps/api/window";
import { IconType } from "react-icons";

import { Button, Pane } from "@/ui";

interface Props {
  icon: IconType;
  title: string;
}

const Titlebar: React.FC<Props> = (props) => {
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

export default Titlebar;
