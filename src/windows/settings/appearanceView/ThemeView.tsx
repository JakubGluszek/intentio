import React from "react";
import { createPortal } from "react-dom";
import { MdSettings } from "react-icons/md";

import app from "@/app";
import services from "@/app/services";
import { Theme } from "@/bindings/Theme";
import { Button } from "@/components";
import EditThemeModal from "./EditThemeModal";

interface Props {
  theme: Theme;
}

const ThemeView: React.FC<Props> = ({ theme }) => {
  const [viewEdit, setViewEdit] = React.useState(false);

  const store = app.useStore();

  return viewEdit ? (
    createPortal(
      <EditThemeModal theme={theme} hide={() => setViewEdit(false)} />,
      document.getElementById("root")!
    )
  ) : (
    <div
      style={{ color: theme.text_hex }}
      className="group flex flex-col rounded overflow-clip shadow"
      onClick={(e) =>
        // @ts-ignore
        !e.target.closest("button") && services.setCurrentTheme(theme.id)
      }
      data-tauri-disable-drag
    >
      <div
        style={{
          border: theme.base_hex,
        }}
        className="relative h-9 flex flex-row items-center rounded border-2"
      >
        {/* Area to set theme as the current theme */}
        <div
          style={{ backgroundColor: theme.primary_hex }}
          className="min-w-[40px] h-full"
        ></div>

        {/* Heading */}
        <div
          style={{
            backgroundColor: theme.window_hex,
          }}
          className="w-full h-full flex flex-row items-center justify-between px-2"
        >
          <span data-tauri-disable-drag style={{ color: theme.text_hex }}>
            {theme.name}
          </span>
          {!theme.default && (
            <div className="hidden group-hover:flex">
              <Button
                transparent
                style={{ color: theme.primary_hex }}
                onClick={() => setViewEdit(!viewEdit)}
              >
                <MdSettings size={24} />
              </Button>
            </div>
          )}
        </div>

        {/* Current theme indicator */}
        {theme.id === store.currentTheme?.id && (
          <div
            style={{ backgroundColor: theme.primary_hex }}
            className="w-full h-0.5 absolute bottom-0"
          ></div>
        )}
      </div>
    </div>
  );
};

export default ThemeView;
