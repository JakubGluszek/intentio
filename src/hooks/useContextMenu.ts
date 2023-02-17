import React from "react";

export const useContextMenu = () => {
  const [viewMenu, setViewMenu] = React.useState<{ leftPosition: number; topPosition: number }>();

  const onContextMenuHandler = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setViewMenu({ leftPosition: e.pageX, topPosition: e.pageY });
  };

  return { viewMenu, setViewMenu, onContextMenuHandler };
};
