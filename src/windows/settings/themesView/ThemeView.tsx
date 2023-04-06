import React from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

import { Button, ContextMenu } from "@/components";
import { MenuPosition, useContextMenu } from "@/hooks/useContextMenu";
import { Theme } from "@/bindings/Theme";
import ipc from "@/ipc";
import { emit } from "@tauri-apps/api/event";
import useStore from "@/store";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  data: Theme;
  isSelected?: boolean;
  onViewEdit?: () => void;
  onViewConfig?: () => void;
  disableContextMenu?: boolean;
}

const ThemeView: React.FC<Props> = (props) => {
  const { disableContextMenu = false, isSelected = false } = props;
  const { menuPosition, setMenuPosition, onContextMenuHandler } =
    useContextMenu();
  const hideContextMenu = () => setMenuPosition(undefined);
  const store = useStore();

  return (
    <React.Fragment>
      <div
        {...props}
        className="group opacity-80 hover:opacity-100 flex flex-row h-9 font-black overflow-clip shadow-lg cursor-pointer rounded-sm"
        style={{
          color: props.data.text_hex,
          borderColor: isSelected
            ? props.data.primary_hex
            : menuPosition
              ? props.data.primary_hex
              : props.data.base_hex,
          borderWidth: 2,
          backgroundColor: props.data.window_hex,
        }}
        onContextMenu={onContextMenuHandler}
        onMouseDown={(e) => {
          if (!e.ctrlKey && e.button === 0) {
            emit("preview_theme", props.data);
          }
          props.onMouseDown?.(e);
        }}
        onMouseUp={(e) => {
          if (!e.ctrlKey) {
            emit("preview_theme", store.currentTheme);
          }
          props.onMouseUp?.(e);
        }}
        onMouseOut={(e) => {
          if (!e.ctrlKey) {
            emit("preview_theme", store.currentTheme);
          }
          props.onMouseOut?.(e);
        }}
        data-tauri-disable-drag
      >
        <div
          style={{ backgroundColor: props.data.primary_hex }}
          className="min-w-[36px] h-full"
        ></div>
        <div className="w-full h-full flex flex-row items-center justify-between px-2">
          <span data-tauri-disable-drag style={{ color: props.data.text_hex }}>
            {props.data.name}
          </span>
          <div
            style={{
              color: menuPosition
                ? props.data.primary_hex
                : props.data.base_hex,
            }}
          >
            {props.data.favorite ? (
              <MdFavorite size={20} />
            ) : (
              <MdFavoriteBorder size={20} />
            )}
          </div>
        </div>
      </div>

      {!disableContextMenu && (
        <ThemeViewContext
          display={menuPosition ? true : false}
          position={menuPosition!}
          hide={() => hideContextMenu()}
        >
          <Button
            onClick={() =>
              ipc
                .updateTheme(props.data.id, { favorite: !props.data.favorite })
                .then(() => hideContextMenu())
            }
            rounded={false}
          >
            Favorite
          </Button>
          <Button onClick={() => props.onViewEdit?.()} rounded={false}>
            Edit
          </Button>
          <Button rounded={false}>Delete</Button>
        </ThemeViewContext>
      )}
    </React.Fragment>
  );
};

interface ThemeViewContextProps {
  children: React.ReactNode;
  display: boolean;
  position: MenuPosition;
  hide: () => void;
}

const ThemeViewContext: React.FC<ThemeViewContextProps> = (props) => {
  return <ContextMenu {...props}>{props.children}</ContextMenu>;
};
export default ThemeView;
