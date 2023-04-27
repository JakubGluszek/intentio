import React from "react";

/** Prevents default context menu on production build
Hold CTRL and right click to access context menu on a dev build */
export const usePreventContextMenu = () => {
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
