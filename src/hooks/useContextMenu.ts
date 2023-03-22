import React from "react";

export type MenuPosition = {
  left: number;
  top: number;
};

export const useContextMenu = () => {
  const [menuPosition, setMenuPosition] = React.useState<MenuPosition>();

  const onContextMenuHandler = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setMenuPosition({ left: e.pageX, top: e.pageY });
  };

  return { menuPosition, setMenuPosition, onContextMenuHandler };
};
