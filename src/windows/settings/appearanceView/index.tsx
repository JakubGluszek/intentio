import React from "react";
import { createPortal } from "react-dom";
import { MdAddCircle } from "react-icons/md";
import { Checkbox } from "@mantine/core";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import useStore from "@/store";
import ipc from "@/ipc";
import { Button } from "@/components";
import { useEvent } from "@/hooks";
import { Settings } from "@/bindings/Settings";
import { SettingsForUpdate } from "@/bindings/SettingsForUpdate";
import CreateThemeModal from "./CreateThemeModal";
import ThemeView from "./ThemeView";

interface Props {
  settings: Settings;
  update: (data: Partial<SettingsForUpdate>) => Promise<Settings>;
}

const AppearanceView: React.FC<Props> = (props) => {
  const [viewCreate, setViewCreate] = React.useState(false);

  const store = useStore();

  const themes = useStore((state) => state.themes);
  const setThemes = useStore((state) => state.setThemes);
  const currentTheme = useStore((state) => state.currentTheme);

  React.useEffect(() => {
    ipc.getThemes().then((data) => setThemes(data));
  }, []);

  useEvent("settings_updated", (event) => store.setSettings(event.payload));

  const [themesContainer] = useAutoAnimate<HTMLDivElement>();

  return (
    <div className="flex flex-col gap-3 pb-2 animate-in fade-in-0 zoom-in-95">
      {/* Display live countdown checkbox */}
      <div className="text-text/80">Display</div>
      <div className="flex flex-row items-center card">
        <label className="w-full" htmlFor="display-live-countdown">
          Timer countdown
        </label>
        <Checkbox
          tabIndex={-2}
          id="display-live-countdown"
          size="sm"
          checked={props.settings.display_live_countdown}
          onChange={(value) =>
            props.update({
              display_live_countdown: value.currentTarget.checked,
            })
          }
          styles={{
            icon: { color: "rgb(var(--primary-color)) !important" },
            root: { height: "20px" },
          }}
          classNames={{
            input:
              "border-primary checked:border-primary bg-transparent checked:bg-transparent border-2",
          }}
        />
      </div>

      <div className="text-text/80">Themes</div>
      <div>
        <Button transparent onClick={() => setViewCreate(true)}>
          <MdAddCircle size={20} />
          <span>Add theme</span>
        </Button>
      </div>

      <div ref={themesContainer} className="flex flex-col gap-1.5">
        {themes
          .sort((a, b) => (a.default ? 1 : 0) - (b.default ? 1 : 0))
          .map((theme) => (
            <ThemeView key={theme.id} theme={theme} />
          ))}
      </div>

      {/* Create theme modal popup */}
      {viewCreate &&
        currentTheme &&
        createPortal(
          <CreateThemeModal
            theme={currentTheme}
            hide={() => setViewCreate(false)}
          />,
          document.getElementById("root")!
        )}
    </div>
  );
};

export default AppearanceView;
