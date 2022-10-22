import React from "react";
import { MdAddCircle, MdCircle, MdColorLens } from "react-icons/md";
import { WebviewWindow } from "@tauri-apps/api/window";

import { Settings } from "../../bindings/Settings";
import { Theme } from "../../bindings/Theme";
import { ipc_invoke } from "../../ipc";
import { emit } from "@tauri-apps/api/event";

interface Props {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings | undefined>>;
}

const ThemeSection: React.FC<Props> = ({ settings, setSettings }) => {
  const [themes, setThemes] = React.useState<Theme[]>([]);

  React.useEffect(() => {
    ipc_invoke<Theme[]>("get_themes").then((res) => setThemes(res.data));
  }, []);

  const updateCurrentTheme = async (theme: Theme) => {
    ipc_invoke<Settings>("update_settings", {
      current_theme_id: theme.id,
    }).then((res) => {
      setSettings(res.data);
      emit("update_current_theme", theme);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-center gap-2">
        <MdColorLens size={28} />
        <span className="text-lg">Themes</span>
      </div>
      <div className="flex flex-col gap-4">
        <button className="btn btn-ghost justify-start" onMouseUp={() => null}>
          <MdAddCircle size={24} />
          <span>Add a theme</span>
        </button>
        <div className="flex flex-col gap-2">
          {themes &&
            themes.map((theme) => (
              <div
                key={theme.id}
                style={{
                  backgroundColor: theme.window_hex,
                  border: theme.base_hex,
                }}
                className={`relative h-10 flex flex-row items-center gap-4 rounded border-2`}
                onMouseUp={() => updateCurrentTheme(theme)}
              >
                <div
                  style={{ backgroundColor: theme.primary_hex }}
                  className={`w-12 h-full rounded-l`}
                ></div>
                <span style={{ color: theme.text_hex }}>{theme.name}</span>
                <div
                  style={{ backgroundColor: theme.primary_hex }}
                  className="w-full h-0.5 absolute bottom-0 rounded-b"
                ></div>
                {theme.id === settings.current_theme_id && (
                  <MdCircle
                    size={16}
                    className="absolute top-auto bottom-auto right-4 text-primary"
                  />
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSection;
