import React from "react";
import { appWindow } from "@tauri-apps/api/window";
import { MdClose } from "react-icons/md";

import Button from "./Button";
import useGlobal from "@/app/store";

interface Props {
  children: React.ReactNode;
  icon?: React.ReactNode;
  label?: string;
  header?: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children, icon, label, header }) => {
  const currentTheme = useGlobal((state) => state.currentTheme);

  if (!currentTheme) return null;

  return (
    <div className="w-screen h-screen max-h-screen flex flex-col gap-2 overflow-hidden">
      {header ?? (
        <div className="h-10 flex flex-col gap-2 bg-window p-2">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              {icon ?? null}
              <span className="text-xl">{label}</span>
            </div>
            <Button transparent onClick={() => appWindow.close()}>
              <MdClose size={32} />
            </Button>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default Layout;
