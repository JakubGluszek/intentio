import React from "react";
import { MdSettings } from "react-icons/md";

import useStore from "@/store";
import ipc from "@/ipc";
import { Theme } from "@/bindings/Theme";
import { Button } from "@/components";
import EditThemeModal from "./EditThemeModal";

interface Props {
  theme: Theme;
}

const ThemeView: React.FC<Props> = (props) => {
  const [viewEdit, setViewEdit] = React.useState(false);

  return (
    <React.Fragment>
      <ThemeContent {...props} onViewEdit={() => setViewEdit(true)} />
      <EditThemeModal
        display={viewEdit}
        theme={props.theme}
        hide={() => setViewEdit(false)}
      />
    </React.Fragment>
  );
};

interface ThemeContentProps extends Props {
  onViewEdit: () => void;
}

const ThemeContent: React.FC<ThemeContentProps> = ({ theme, onViewEdit }) => {
  const store = useStore();
  const isSelected = theme.id === store.currentTheme?.id;

  return (
    <div
      style={{ color: theme.text_hex }}
      className="group flex flex-col rounded overflow-clip border-2 border-base"
      onClick={(e) =>
        // @ts-ignore
        !e.target.closest("button") && ipc.setCurrentTheme(theme.id)
      }
      data-tauri-disable-drag
    >
      <div
        style={{
          border: theme.base_hex,
        }}
        className="relative h-9 flex flex-row items-center"
      >
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
          {!theme.default ? (
            <div className="hidden group-hover:flex">
              <Button
                transparent
                style={{ color: theme.primary_hex }}
                onClick={() => onViewEdit()}
              >
                <MdSettings size={24} />
              </Button>
            </div>
          ) : null}
        </div>

        {/* Current theme indicator */}
        {isSelected ? (
          <div
            style={{ backgroundColor: theme.primary_hex }}
            className="w-full h-[3px] absolute bottom-0"
          ></div>
        ) : null}
      </div>
    </div>
  );
};

export default ThemeView;
