import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Theme, Colors, State } from "../types";
import { applyTheme } from "../utils";
import { emit } from "@tauri-apps/api/event";

const useTheme = () => {
  const [currentTheme, setCurrentTheme] = React.useState<Theme>();
  const [themes, setThemes] = React.useState<Theme[]>([]);

  React.useEffect(() => {
    read();
    invoke<State>("read_state").then((state) => {
      setCurrentTheme(state.theme);
      applyTheme(state.theme);
    });
  }, []);

  const changeTheme = async (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  const updateCurrentTheme = async (theme: Theme) => {
    changeTheme(theme);
    const state = await invoke<State>("read_state");
    invoke<State>("update_state", { state: { ...state, theme } });
    emit("apply_theme", theme);
  };

  const read = () => {
    invoke<Theme[]>("read_themes").then((themes) => setThemes(themes));
    return;
  };

  const create = (name: string, colors: Colors) => {
    invoke<Theme[]>("save_theme", { name, colors }).then((themes) =>
      setThemes(themes)
    );
    return;
  };

  const update = (themes: Theme[]) => {
    invoke<Theme[]>("update_themes", { themes }).then((themes) =>
      setThemes(themes)
    );
    return;
  };

  return {
    theme: currentTheme,
    changeTheme,
    updateCurrentTheme,
    themes,
    create,
    update,
  };
};

export default useTheme;
