import React from "react";
import { createPortal } from "react-dom";
import { MdAddCircle } from "react-icons/md";
import { Checkbox } from "@mantine/core";

import useStore from "@/store";
import ipc from "@/ipc";
import { Button } from "@/components";
import { Settings } from "@/bindings/Settings";
import { SettingsForUpdate } from "@/bindings/SettingsForUpdate";
import CreateThemeModal from "./CreateThemeModal";
import ThemeView from "./ThemeView";
import { useEvent } from "@/hooks";

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

  return (
    <>
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
      <div className="flex flex-col gap-4 pb-2">
        {/* Display live countdown checkbox */}
        <div>Display</div>
        <div className="flex flex-row items-center justify-between rounded p-1.5 bg-window shadow">
          <label htmlFor="display-live-countdown">Timer countdown</label>
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

        <div className="flex flex-row items-center justify-between">
          <div className="">Themes</div>
          <Button
            style={{ height: "28px" }}
            transparent
            onClick={() => setViewCreate(true)}
          >
            <MdAddCircle size={28} />
          </Button>
        </div>
        <div className="flex flex-col gap-1.5">
          {/* Array of themes */}
          {themes
            .sort((a, b) => (a.default ? 1 : 0) - (b.default ? 1 : 0))
            .map((theme) => (
              <ThemeView key={theme.id} theme={theme} />
            ))}
        </div>
      </div>
    </>
  );
};

export default AppearanceView;
