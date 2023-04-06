import React from "react";
import { MdClose } from "react-icons/md";
import { appWindow } from "@tauri-apps/api/window";

import Button from "./Button";

interface Props {
  icon: React.ReactNode;
  title: string;
}

const Titlebar: React.FC<Props> = (props) => {
  return (
    <div className="h-10 flex flex-col window bg-window rounded rounded-b-none overflow-clip">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-0.5 p-1 text-text/70 font-black">
          {props.icon}
          <span className="text-lg">{props.title}</span>
        </div>
        <Button transparent rounded={false} onClick={() => appWindow.close()}>
          <MdClose size={24} />
        </Button>
      </div>
    </div>
  );
};

export default Titlebar;
