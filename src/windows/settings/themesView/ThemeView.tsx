import React from "react";

import { Button, ContextMenu } from "@/components";
import { MenuPosition, useContextMenu } from "@/hooks/useContextMenu";
import { Theme } from "@/bindings/Theme";

interface Props {
  data: Theme;
  onViewEdit: () => void;
  onSelected: () => void;
}

const ThemeView: React.FC<Props> = (props) => {
  const { menuPosition, setMenuPosition, onContextMenuHandler } =
    useContextMenu();

  const hideContextMenu = () => setMenuPosition(undefined);

  return (
    <React.Fragment>
      <ThemeViewContent
        {...props}
        onContextMenuHandler={onContextMenuHandler}
      />
      <ThemeViewContext
        display={menuPosition ? true : false}
        position={menuPosition!}
        onEdit={() => props.onViewEdit()}
        hide={() => hideContextMenu()}
      />
    </React.Fragment>
  );
};

interface ThemeViewContentProps extends Props {
  onContextMenuHandler: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const ThemeViewContent: React.FC<ThemeViewContentProps> = (props) => {
  return (
    <div
      onClick={() => props.onSelected()}
      onContextMenu={props.onContextMenuHandler}
      style={{ color: props.data.text_hex }}
      className="group flex flex-col rounded-sm overflow-clip border-2 border-base"
      data-tauri-disable-drag
    >
      <div
        style={{
          border: props.data.base_hex,
        }}
        className="relative h-9 flex flex-row"
      >
        <div
          style={{ backgroundColor: props.data.primary_hex }}
          className="min-w-[40px] h-full"
        ></div>
        <div
          style={{
            backgroundColor: props.data.window_hex,
          }}
          className="w-full h-full flex flex-row items-center justify-between px-2"
        >
          <span data-tauri-disable-drag style={{ color: props.data.text_hex }}>
            {props.data.name}
          </span>
        </div>
      </div>
    </div>
  );
};

interface ThemeViewContextProps {
  display: boolean;
  position: MenuPosition;
  hide: () => void;
  onEdit: () => void;
}

const ThemeViewContext: React.FC<ThemeViewContextProps> = (props) => {
  return (
    <ContextMenu {...props}>
      <Button rounded={false}>Favorite</Button>
      <Button onClick={() => props.onEdit()} rounded={false}>
        Edit
      </Button>
      <Button rounded={false}>Delete</Button>
    </ContextMenu>
  );
};
export default ThemeView;
