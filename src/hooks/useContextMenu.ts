import React from "react";

export type MenuPosition = {
  left: number;
  top: number;
};

export const useContextMenu = () => {
  const [display, setDisplay] = React.useState(false);
  const [position, setPosition] = React.useState<MenuPosition>();

  const onContextMenuHandler = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setPosition({ left: e.pageX, top: e.pageY });
    show();
  };

  const show = () => setDisplay(true);
  const hide = () => setDisplay(false);

  return [
    { display, position, show, hide, setPosition },
    onContextMenuHandler,
  ] as const;
};
