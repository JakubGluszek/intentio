import React from "react";
import { MdAddCircle, MdFavorite, MdFavoriteBorder } from "react-icons/md";

import useStore from "@/store";
import ipc from "@/ipc";
import { Button } from "@/components";
import { Theme } from "@/bindings/Theme";
import EditTheme from "./EditTheme";
import CreateTheme from "./CreateTheme";
import ThemesList from "./ThemesList";

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
              ipc.updateInterfaceConfig({ idle_theme_id: theme.id });
              break;
            case "focus":
              ipc.updateInterfaceConfig({ focus_theme_id: theme.id });
              break;
            case "break":
              ipc.updateInterfaceConfig({ break_theme_id: theme.id });
              break;
            case "long break":
              ipc.updateInterfaceConfig({ long_break_theme_id: theme.id });
              break;
          }
          setThemeState(null);
        }}
      />
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
      <button
        onClick={() =>
          props.setSelectedState((prev) => (prev !== "idle" ? "idle" : null))
        }
        style={{
          color: idleTheme.primary_hex,
          opacity: props.selectedState === "idle" ? 1.0 : 0.5,
        }}
      >
        Idle
      </button>
      <button
        onClick={() =>
          props.setSelectedState((prev) => (prev !== "focus" ? "focus" : null))
        }
        style={{
          color: focusTheme.primary_hex,
          opacity: props.selectedState === "focus" ? 1.0 : 0.5,
        }}
      >
        Focus
      </button>
      <button
        onClick={() =>
          props.setSelectedState((prev) => (prev !== "break" ? "break" : null))
        }
        style={{
          color: breakTheme.primary_hex,
          opacity: props.selectedState === "break" ? 1.0 : 0.5,
        }}
      >
        Break
      </button>
      <button
        onClick={() =>
          props.setSelectedState((prev) =>
            prev !== "long break" ? "long break" : null
          )
        }
        style={{
          color: longBreakTheme.primary_hex,
          opacity: props.selectedState === "long break" ? 1.0 : 0.5,
        }}
      >
        Long Break
      </button>
    </div>
  );
};

export default ThemesView;
