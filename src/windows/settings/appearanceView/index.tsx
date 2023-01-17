import React from "react";
import { createPortal } from "react-dom";
import { MdAddCircle } from "react-icons/md";
import { Checkbox } from "@mantine/core";

import app from "@/app";
import services from "@/app/services";
import { Button } from "@/components";
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

  const themes = app.useStore((state) => state.themes);
  const setThemes = app.useStore((state) => state.setThemes);
  const currentTheme = app.useStore((state) => state.currentTheme);

  React.useEffect(() => {
    services.getThemes().then((data) => setThemes(data));
  }, []);

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
      <div className="flex flex-col gap-4 p-2">
        {/* Display live countdown checkbox */}
        <div className="flex flex-row items-center justify-between rounded">
          <label htmlFor="display-live-countdown">Live countdown</label>
          <Checkbox
            id="display-live-countdown"
            size="sm"
            defaultChecked={props.settings.display_live_countdown}
            onChange={(value) =>
              props.update({
                display_live_countdown: value.currentTarget.checked,
              })
            }
            styles={{
              icon: { color: "var(--primary-color) !important" },
              root: { height: "20px" },
            }}
            classNames={{
              input:
                "border-primary checked:border-primary bg-transparent checked:bg-transparent border-2",
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          {/* Display create theme modal */}
          {!viewCreate && (
            <Button
              style={{ width: "fit-content", height: "28px" }}
              onClick={() => setViewCreate(true)}
            >
              <MdAddCircle size={22} />
              <span>Add theme</span>
            </Button>
          )}
          {/* Array of themes */}
          <div className="flex flex-col gap-1.5">
            {themes &&
              themes
                .sort((a, b) => (a.default ? 1 : 0) - (b.default ? 1 : 0))
                .map((theme) => <ThemeView key={theme.id} theme={theme} />)}
          </div>
        </div>
      </div>
    </>
  );
};

export default AppearanceView;
