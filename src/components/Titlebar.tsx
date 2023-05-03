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
    <Pane className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-1 text-text">
        <props.icon size={20} />
        <span className="font-semibold">{props.title}</span>
      </div>
      <Button variant="ghost" onClick={() => appWindow.close()}>
        <MdClose size={24} />
      </Button>
    </Pane>
  );
};

export default Titlebar;
