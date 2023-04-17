import React from "react";
import { MdClose } from "react-icons/md";
import { appWindow } from "@tauri-apps/api/window";
import { Button } from "@/ui";

interface Props {
  icon: React.ReactNode;
  title: string;
}

const Titlebar: React.FC<Props> = (props) => {
  return (
    <div className="h-10 flex flex-col window bg-window rounded rounded-b-none overflow-clip">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-1 p-1 text-text/80">
          {props.icon}
          <span className="text-xl">{props.title}</span>
        </div>
        <Button variant="ghost" onClick={() => appWindow.close()}>
          <MdClose size={28} />
        </Button>
      </div>
    </div>
  );
};

export default Titlebar;
