import React from "react";
import { appWindow } from "@tauri-apps/api/window";

import useStore from "@/store";
import utils from "@/utils";
import ipc from "@/ipc";
import { useEvents } from "@/hooks";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = (props) => {
  const store = useStore();

  useDragWindow(store.tauriDragEnabled);

  useEvents({
    settings_updated: (data) => store.setSettings(data),
    current_theme_changed: () =>
      ipc.getCurrentTheme().then((data) => {
        utils.applyTheme(data);
        store.setCurrentTheme(data);
      }),
    preview_theme: (data) => {
      utils.applyTheme(data);
    },
    current_theme_updated: (data) => {
      utils.applyTheme(data);
      store.setCurrentTheme(data);
    },
  });

  React.useEffect(() => {
    ipc.getSettings().then((data) => store.setSettings(data));
    ipc.getCurrentTheme().then((data) => {
      utils.applyTheme(data);
      store.setCurrentTheme(data);
    });
  }, []);

  // prevents default context menu on production build
  // hold CTRL and right click to access context menu on a dev build
  React.useEffect(() => {
    const contextMenuHandler = (event: MouseEvent) => {
      if (import.meta.env.PROD) event.preventDefault();
      else {
        !event.ctrlKey && event.preventDefault();
      }
    };
    document.addEventListener("contextmenu", contextMenuHandler);
    return () =>
      document.removeEventListener("contextmenu", contextMenuHandler);
  }, []);

  if (!store.currentTheme) return null;

  return (
    <div className="relative w-screen h-screen max-h-screen flex flex-col overflow-hidden">
      {props.children}
    </div>
  );
};

/** Starts dragging the window on 'mousedown' event.
 * Dragging will not occur if:
 * - the target element (or it's child element of a fixed depth) was of a certain type (button, input etc.)
 * - the tauriDragEnabled state property was exclusively disabled */
const useDragWindow = (tauriDragEnabled: boolean) => {
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
    const noDragSelector = "input, a, button, label, textarea"; // CSS selectors

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
