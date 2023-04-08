import React from "react";
import {
  MdAddCircle,
  MdFavorite,
  MdFavoriteBorder,
  MdInfoOutline,
} from "react-icons/md";

import useStore from "@/store";
import ipc from "@/ipc";
import { Button } from "@/components";
import { Theme } from "@/bindings/Theme";
import EditTheme from "./EditTheme";
import CreateTheme from "./CreateTheme";
import ThemesList from "./ThemesList";
import { clsx } from "@mantine/core";

type ThemeState = "idle" | "focus" | "break" | "long break";
type Display = "themes" | "create" | "edit";

const ThemesView: React.FC = () => {
  const [theme, setTheme] = React.useState<Theme | null>(null);
  const [themeState, setThemeState] = React.useState<ThemeState | null>(null);
  const [display, setDisplay] = React.useState<Display>("themes");
  const [viewFavoriteOnly, setViewFavoriteOnly] = React.useState(false);

  const store = useStore();

  React.useEffect(() => {
    ipc.getThemes().then((data) => store.setThemes(data));
    ipc.getInterfaceConfig().then((data) => store.setInterfaceConfig(data));
  }, []);

  const setDefaultDisplay = () => setDisplay("themes");

  if (display === "create") return <CreateTheme onHide={setDefaultDisplay} />;
  if (display === "edit" && theme)
    return <EditTheme data={theme} onHide={setDefaultDisplay} />;

  if (store.themes.length === 0) return null;

  return (
    <div className="grow flex flex-col gap-0.5">
      <div className="flex flex-col window bg-window">
        <div className="flex flex-row justify-between p-0.5">
          {/* Prompt create theme view */}
          <Button
            onClick={() => setDisplay("create")}
            transparent
            rounded={false}
            highlight={false}
          >
            <MdAddCircle size={20} />
            <div>Add theme</div>
          </Button>
          <div className="flex flex-row">
            {/* Toggle view only favorite themes */}
            <Button
              onClick={() => setViewFavoriteOnly((prev) => !prev)}
              transparent
              rounded={false}
              highlight={false}
            >
              {viewFavoriteOnly ? (
                <MdFavorite size={24} />
              ) : (
                <MdFavoriteBorder size={24} />
              )}
            </Button>
          </div>
        </div>
        <CurrentThemes
          selectedState={themeState}
          setSelectedState={setThemeState}
        />
      </div>

      <div className="grow flex flex-col window bg-window overflow-y-auto">
        <div className="max-h-0 overflow-y">
          {themeState && (
            <div className="flex flex-row items-center gap-1 p-1.5 text-text/80">
              <MdInfoOutline size={20} />
              <span>Select a new theme</span>
            </div>
          )}
          <ThemesList
            themes={store.themes}
            selectable={!!themeState}
            viewFavoriteOnly={viewFavoriteOnly}
            onThemeViewEdit={(theme) => {
              setDisplay("edit");
              setTheme(theme);
            }}
            onThemeSelected={(theme) => {
              switch (themeState) {
                case "idle":
                  ipc.setIdleTheme(theme);
                  break;
                case "focus":
                  ipc.setFocusTheme(theme);
                  break;
                case "break":
                  ipc.setBreakTheme(theme);
                  break;
                case "long break":
                  ipc.setLongBreakTheme(theme);
                  break;
              }
              setThemeState(null);
            }}
          />
        </div>
      </div>
    </div>
  );
};

interface CurrentThemesProps {
  selectedState: ThemeState | null;
  setSelectedState: React.Dispatch<React.SetStateAction<ThemeState | null>>;
}

const CurrentThemes: React.FC<CurrentThemesProps> = (props) => {
  const store = useStore();

  const idleTheme = store.getIdleTheme()!;
  const focusTheme = store.getFocusTheme()!;
  const breakTheme = store.getBreakTheme()!;
  const longBreakTheme = store.getLongBreakTheme()!;

  return (
    <div className="flex flex-row justify-between font-bold py-1 px-2">
      <CurrentThemeButton
        onClick={() =>
          props.setSelectedState((prev) => (prev !== "idle" ? "idle" : null))
        }
        label="Idle"
        color={idleTheme.primary_hex}
        selected={props.selectedState === "idle"}
      />
      <CurrentThemeButton
        onClick={() =>
          props.setSelectedState((prev) => (prev !== "focus" ? "focus" : null))
        }
        label="Focus"
        color={focusTheme.primary_hex}
        selected={props.selectedState === "focus"}
      />
      <CurrentThemeButton
        onClick={() =>
          props.setSelectedState((prev) => (prev !== "break" ? "break" : null))
        }
        label="Break"
        color={breakTheme.primary_hex}
        selected={props.selectedState === "break"}
      />
      <CurrentThemeButton
        onClick={() =>
          props.setSelectedState((prev) =>
            prev !== "long break" ? "long break" : null
          )
        }
        label="Long Break"
        color={longBreakTheme.primary_hex}
        selected={props.selectedState === "long break"}
      />
    </div>
  );
};

interface CurrentThemeButtonProps {
  onClick: () => void;
  label: string;
  color: string;
  selected: boolean;
}

const CurrentThemeButton: React.FC<CurrentThemeButtonProps> = (props) => {
  return (
    <button
      onClick={() => props.onClick()}
      className={clsx(
        "hover:opacity-100",
        props.selected ? "opacity-100" : "opacity-50"
      )}
      style={{
        color: props.color,
      }}
    >
      {props.label}
    </button>
  );
};

export default ThemesView;
