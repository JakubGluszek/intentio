import React from "react";
import { appWindow } from "@tauri-apps/api/window";
import { Toaster } from "react-hot-toast";

import useStore from "@/store";
import utils from "@/utils";
import ipc from "@/ipc";
import { useEvents } from "@/hooks";

interface Props {
  children: React.ReactNode;
}

/**
 * Layout's functionality is as follows:
 * - auto window dragging on mousedown
 * - preventing default context menu
 * - handles 'settings' and 'currrentTheme' updates; receive and store;
 * - requests settings and current theme;
 * - renders 'Toaster' container next to 'root' div;
 * */
const Layout: React.FC<Props> = (props) => {
  const store = useStore();

  useDragWindow(store.tauriDragEnabled);
  usePreventContextMenu();

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

  if (!store.currentTheme) return null;

  return (
    <React.Fragment>
      {props.children}
      <Toaster
        position="top-center"
        containerStyle={{ top: 8, zIndex: 9999999 }}
        toastOptions={{
          duration: 1400,
          style: {
            padding: 1,
            paddingInline: 2,
            backgroundColor: "rgb(var(--base-color))",
            border: 2,
            borderColor: "rgb(var(--text-color))",
            borderRadius: 2,
            fontSize: 14,
            color: "rgb(var(--text-color))",
            textAlign: "center",
          },
        }}
      />
    </React.Fragment>
  );
};

// prevents default context menu on production build
// hold CTRL and right click to access context menu on a dev build
const usePreventContextMenu = () => {
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
