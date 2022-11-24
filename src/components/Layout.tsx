import React from "react";
import { appWindow } from "@tauri-apps/api/window";
import { IconType } from "react-icons";
import { MdClose } from "react-icons/md";

import Button from "./Button";

interface Props {
  children: React.ReactNode;
  Icon: IconType;
  label: string;
}

const Layout: React.FC<Props> = ({ children, Icon, label }) => {
  return (
    <div className="w-screen min-h-screen flex flex-col gap-2">
      <div className="z-[9999] sticky top-0 flex flex-col gap-2 bg-window px-4 py-2">
        <div
          data-tauri-drag-region
          className="flex flex-row items-center justify-between"
        >
          <div className="flex flex-row items-center gap-2">
            <Icon size={32} />
            <span className="text-xl">{label}</span>
          </div>
          <Button transparent onClick={() => appWindow.close()}>
            <MdClose size={32} />
          </Button>
        </div>
      </div>

      {children}
    </div>
  );
};

export default Layout;
