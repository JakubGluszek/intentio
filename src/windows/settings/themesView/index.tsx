import React from "react";
import {
  MdAddCircle,
  MdFavorite,
  MdFavoriteBorder,
  MdInfoOutline,
} from "react-icons/md";
import { clsx } from "@mantine/core";

import useStore from "@/store";
import ipc from "@/ipc";
import { Theme } from "@/bindings/Theme";
import EditTheme from "./EditTheme";
import CreateTheme from "./CreateTheme";
import ThemesList from "./ThemesList";
import { Button, Pane } from "@/ui";

type ThemeState = "idle" | "focus" | "break" | "long break";
type Display = "themes" | "create" | "edit";

const ThemesView: React.FC = () => {
  const [theme, setTheme] = React.useState<Theme | null>(null);
  const [themeState, setThemeState] = React.useState<ThemeState | null>(null);
  const [display, setDisplay] = React.useState<Display>("themes");
  const [viewFavoriteOnly, setViewFavoriteOnly] = React.useState(false);
  const [viewChangeThemes, setViewChangeThemes] = React.useState(false);

  const store = useStore();

  React.useEffect(() => {
    ipc.getThemes().then((data) => store.setThemes(data));
    ipc.getInterfaceConfig().then((data) => store.setInterfaceConfig(data));
  }, []);

  const setDefaultDisplay = () => setDisplay("themes");

  if (display === "create") return <CreateTheme onExit={setDefaultDisplay} />;
  if (display === "edit" && theme)
    return <EditTheme data={theme} onExit={setDefaultDisplay} />;

  if (store.themes.length === 0) return null;

  return (
    <Pane className="grow flex flex-col overflow-y-auto gap-2" padding="lg">
      <div className="flex flex-row justify-between">
        {/* Prompt create theme view */}
        <Button variant="base" onClick={() => setDisplay("create")}>
          <MdAddCircle size={20} />
          <div>Add theme</div>
        </Button>
        <div className="flex flex-row">
          {/* Toggle view only favorite themes */}
          <Button
            onClick={() => setViewFavoriteOnly((prev) => !prev)}
            variant="ghost"
          >
            {viewFavoriteOnly ? (
              <MdFavorite size={24} />
            ) : (
              <MdFavoriteBorder size={24} />
            )}
          </Button>
        </div>
      </div>
      {viewChangeThemes ? (
        <CurrentThemes
          selectedState={themeState}
          setSelectedState={setThemeState}
        />
      ) : (
        <Button variant="ghost" onClick={() => setViewChangeThemes(true)}>
          Change themes
        </Button>
      )}

      {themeState && (
        <div className="flex flex-row items-center gap-1 text-text/80">
          <MdInfoOutline size={20} />
          <span>Select a new theme</span>
        </div>
      )}
      <div className="max-h-0 overflow-y">
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
    </Pane>
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
    <div className="flex flex-row justify-between font-bold">
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
        label="L. Break"
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
