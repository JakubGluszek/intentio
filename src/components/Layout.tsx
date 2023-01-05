import React from "react";
import { appWindow } from "@tauri-apps/api/window";
import { MdClose } from "react-icons/md";

import app from "@/app";
import utils from "@/utils";
import services from "@/app/services";
import Button from "./Button";

interface Props {
  children: React.ReactNode;
  icon?: React.ReactNode;
  label?: string;
  header?: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children, icon, label, header }) => {
  const currentTheme = app.useStore((state) => state.currentTheme);
  const store = app.useStore();

  useDetectNoDrag();

  React.useEffect(() => {
    services.getCurrentTheme().then((data) => {
      utils.applyTheme(data);
      store.setCurrentTheme(data);
    });
  }, []);

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
              <MdClose size={28} />
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
    const noDragSelector = "input, a, button, svg, label, textarea"; // CSS selector

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
