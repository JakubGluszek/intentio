import React from "react";
import { MdEdit, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { emit } from "@tauri-apps/api/event";

import ipc from "@/ipc";
import useStore from "@/store";
import { useContextMenu } from "@/hooks";
import { Theme } from "@/bindings/Theme";

interface Props {
  data: Theme;
  selectable: boolean;
  onViewEdit: () => void;
  onSelected: () => void;
}

const ThemeView: React.FC<Props> = (props) => {
  const store = useStore();
  const [menu, onContextMenuHandler] = useContextMenu();

  const handleToggleFavorite = () =>
    ipc
      .updateTheme(props.data.id, { favorite: !props.data.favorite })
      .then(() => menu.hide());

  return (
    <div
      onClick={(e) =>
        // @ts-ignore
        !e.target.closest("button") && props.selectable && props.onSelected()
      }
      className="group flex flex-row h-9 font-black overflow-clip shadow-lg rounded-sm"
      style={{
        color: props.data.text_hex,
        borderColor: props.data.base_hex,
        borderWidth: 2,
        backgroundColor: props.data.window_hex,
        cursor: props.selectable ? "pointer" : "default",
      }}
      onContextMenu={onContextMenuHandler}
      data-tauri-disable-drag
    >
      <button
        className="min-w-[32px] h-full cursor-pointer"
        style={{ backgroundColor: props.data.primary_hex }}
        onMouseDown={() => {
          if (props.selectable) {
            props.onSelected();
            return;
          }
          emit("preview_theme", props.data);
        }}
        onMouseUp={() => emit("preview_theme", store.currentTheme)}
        onMouseOut={() => emit("preview_theme", store.currentTheme)}
      ></button>

      <div className="w-full h-full flex flex-row justify-between">
        <div
          className="h-full flex items-center justify-center opacity-80 px-2 text-sm font-bold"
          style={{ color: props.data.text_hex }}
        >
          {props.data.name}
        </div>

        {/* Theme operations */}
        {props.selectable === false && (
          <div className="flex flex-row gap-2 px-2">
            {!props.data.default && (
              <button
                onClick={() => props.onViewEdit()}
                className="opacity-60 hover:opacity-100 duration-75"
                style={{
                  color: props.data.primary_hex,
                }}
              >
                <MdEdit size={20} />
              </button>
            )}
            <button
              onClick={() => handleToggleFavorite()}
              className="opacity-60 hover:opacity-100"
              style={{
                color: props.data.primary_hex,
              }}
            >
              {props.data.favorite ? (
                <MdFavorite size={20} />
              ) : (
                <MdFavoriteBorder size={20} />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeView;
