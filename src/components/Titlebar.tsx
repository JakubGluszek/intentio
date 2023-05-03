import React from "react";
import { MdClose } from "react-icons/md";
import { appWindow } from "@tauri-apps/api/window";
import { Button, Pane } from "@/ui";

interface Props {
  icon: React.ReactNode;
  title: string;
}

const Titlebar: React.FC<Props> = (props) => {
  return (
    <Pane className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-1 text-text">
        {props.icon}
        <span className="text-xl font-semibold">{props.title}</span>
      </div>
      <Button variant="ghost" onClick={() => appWindow.close()}>
        <MdClose size={28} />
      </Button>
    </Pane>
  );
};

export default Titlebar;
