import React from "react";
import { appWindow } from "@tauri-apps/api/window";
import { MdClose } from "react-icons/md";

import Button from "./Button";
import { useStore } from "@/app/store";

interface Props {
  children: React.ReactNode;
  icon?: React.ReactNode;
  label?: string;
  header?: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children, icon, label, header }) => {
  const currentTheme = useStore((state) => state.currentTheme);

  useDetectNoDrag();

  if (!currentTheme) return null;

  return (
    <div className="w-screen h-screen max-h-screen flex flex-col gap-2 overflow-hidden">
      {header ?? (
        <div className="h-10 flex flex-col gap-2 p-2">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              {icon ?? null}
              <span className="text-xl">{label}</span>
            </div>
            <Button tabIndex={-1} transparent onClick={() => appWindow.close()}>
              <MdClose size={32} />
            </Button>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

const useDetectNoDrag = () => {
  React.useEffect(() => {
    const noDragSelector = "input, a, button, svg"; // CSS selector

    const handleMouseDown = async (e: MouseEvent) => {
      if (
        // @ts-ignore
        e.target?.closest(noDragSelector) ||
        // @ts-ignore
        e.target.getAttribute("data-tauri-disable-drag") ||
        // @ts-ignore
        e.target?.parentNode.getAttribute("data-tauri-disable-drag") ||
        // @ts-ignore
        e.target?.parentNode.parentNode.getAttribute("data-tauri-disable-drag")
      )
        return; // a non-draggable element either in target or its ancestors
      await appWindow.startDragging();
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);
};

export default Layout;
