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
    <div className="flex flex-col window overflow-clip">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-1 p-1">
          {props.icon}
          <span className="text-lg">{props.title}</span>
        </div>
        <Button transparent onClick={() => appWindow.close()}>
          <MdClose size={28} />
        </Button>
      </div>
    </div>
  );
};

export default Titlebar;
