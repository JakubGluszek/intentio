import React from "react";
import { MdEdit, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { FaClone } from "react-icons/fa";
import { emit } from "@tauri-apps/api/event";
import { clsx } from "@mantine/core";

import ipc from "@/ipc";
import useStore from "@/store";
import { Tooltip } from "@/ui";
import { Theme } from "@/bindings/Theme";

interface ThemeViewProps {
  data: Theme;
  isSelectable?: boolean;
  onViewEdit?: (theme: Theme) => void;
  onSelected?: (theme: Theme) => void;
}

const ThemeView: React.FC<ThemeViewProps> = (props) => {
  const store = useStore();

  const handleToggleFavorite = () =>
    ipc.updateTheme(props.data.id, { favorite: !props.data.favorite });

  return (
    <div
      onClick={(e) =>
        // @ts-ignore
        !e.target.closest("button") &&
        props.isSelectable &&
        props.onSelected?.(props.data)
      }
      className="group flex flex-row h-9 font-black overflow-clip shadow-lg rounded-sm border-2 border-base/30"
      style={{
        color: props.data.text_hex,
        backgroundColor: props.data.window_hex,
        cursor: props.isSelectable ? "pointer" : "default",
      }}
      data-tauri-disable-drag
    >
      <Tooltip label="Hold to preview">
        <button
          className="min-w-[32px] h-full cursor-pointer"
          style={{ backgroundColor: props.data.primary_hex }}
          onMouseDown={() => emit("preview_theme", props.data)}
          onMouseUp={() => emit("preview_theme", store.currentTheme)}
          onMouseOut={() => emit("preview_theme", store.currentTheme)}
        ></button>
      </Tooltip>

      <div className="w-full h-full flex flex-row justify-between">
        <div
          className="h-full flex items-center justify-center opacity-80 px-2 text-sm font-bold"
          style={{ color: props.data.text_hex }}
        >
          {props.data.name}
        </div>

        {/* Theme operations */}
        <div className="flex flex-row items-center gap-2 px-2">
          {!props.isSelectable && (
            <Tooltip label="Edit">
              {!props.data.default && (
                <button
                  onClick={() => props.onViewEdit?.(props.data)}
                  className="h-8 opacity-0 group-hover:opacity-80 hover:opacity-100 transition-opacity duration-300"
                  style={{
                    color: props.data.primary_hex,
                  }}
                >
                  <MdEdit size={20} />
                </button>
              )}
            </Tooltip>
          )}

          <Tooltip label="Clone">
            <button
              onClick={() =>
                ipc.createTheme({
                  ...props.data,
                  name: `${props.data.name} (copy)`,
                })
              }
              className="h-8 opacity-0 group-hover:opacity-80 hover:opacity-100 transition-opacity duration-300"
              style={{
                color: props.data.primary_hex,
              }}
            >
              <FaClone size={16} />
            </button>
          </Tooltip>

          <Tooltip label={props.data.favorite ? "Drop favorite" : "Favorite"}>
            <button
              onClick={() => handleToggleFavorite()}
              className={clsx(
                "h-8 transition-opacity duration-300",
                props.data.favorite
                  ? "opacity-80 hover:opacity-100"
                  : "opacity-0 group-hover:opacity-80 hover:opacity-100"
              )}
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
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ThemeView;
