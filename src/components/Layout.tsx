import React from "react";
import { appWindow } from "@tauri-apps/api/window";
import { MdClose } from "react-icons/md";

import useStore from "@/store";
import utils from "@/utils";
import ipc from "@/ipc";
import { useEvent } from "@/hooks";
import Button from "./Button";

interface Props {
  children: React.ReactNode;
  icon?: React.ReactNode;
  label?: string;
  header?: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children, icon, label, header }) => {
  const currentTheme = useStore((state) => state.currentTheme);
  const store = useStore();

  useDetectNoDrag(store.tauriDragEnabled);

  React.useEffect(() => {
    ipc.getCurrentTheme().then((data) => {
      utils.applyTheme(data);
      store.setCurrentTheme(data);
    });
  }, []);

  useEvent("preview_theme", (e) => {
    utils.applyTheme(e.payload);
  });
  useEvent("current_theme_updated", (e) => {
    utils.applyTheme(e.payload);
    store.setCurrentTheme(e.payload);
  });

  if (!currentTheme) return null;

  return (
    <div className="w-screen h-screen max-h-screen flex flex-col gap-2 overflow-hidden">
      {header ?? (
        <div className="h-8 flex flex-col gap-2 p-2">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              {icon ?? null}
              <span className="text-xl">{label}</span>
            </div>
            <Button transparent onClick={() => appWindow.close()}>
              <MdClose size={28} />
            </Button>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

const useDetectNoDrag = (tauriDragEnabled: boolean) => {
  React.useEffect(() => {
    const handleMouseDown = async (e: MouseEvent) => {
      if (
        checkAllowDragging(
          "data-tauri-disable-drag",
          e.target as HTMLElement,
          15
        ) ||
        !tauriDragEnabled
      )
        return; // a non-draggable element either in target or its ancestors
      await appWindow.startDragging();
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [tauriDragEnabled]);

  const checkAllowDragging = (
    attribute: string,
    element: HTMLElement,
    iterations: number
  ): boolean => {
    const noDragSelector = "input, a, button, svg, label, textarea"; // CSS selector

    if (
      iterations > 0 &&
      (element.getAttribute(attribute) || element.closest(noDragSelector))
    ) {
      return true;
    }

    const parent = element.parentElement;

    if (!parent) {
      return false;
    }

    return checkAllowDragging(attribute, parent, iterations - 1);
  };
};

export default Layout;
