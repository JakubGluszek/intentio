import React from "react";
import { appWindow } from "@tauri-apps/api/window";

/** Starts dragging the window on 'mousedown' event.
 * Dragging will not occur if:
 * - the target element (or it's child element of a fixed depth) was of a certain type (button, input etc.)
 * - the tauriDragEnabled state property was exclusively disabled */
export const useDragWindow = () => {
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    const handleMouseDown = async (e: MouseEvent) => {
      if (
        checkAllowDragging(
          "data-tauri-disable-drag",
          e.target as HTMLElement,
          15
        )
      )
        return; // a non-draggable element either in target or its ancestors
      setIsDragging(true);
      await appWindow.startDragging().then(() => setIsDragging(false));
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const checkAllowDragging = (
    attribute: string,
    element: HTMLElement,
    iterations: number
  ): boolean => {
    const noDragSelector = "input, a, button, label, textarea, scrollbar"; // CSS selectors

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

  return { isDragging } as const;
};
