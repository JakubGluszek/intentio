import React from "react";
import { MdAddCircle, MdColorLens } from "react-icons/md";

import app from "@/app";
import services from "@/app/services";
import Button from "@/components/Button";
import ThemeView from "./ThemeView";
import CreateThemeView from "./CreateThemeView";

const ThemeSection: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);

  const themes = app.useStore((state) => state.themes);
  const setThemes = app.useStore((state) => state.setThemes);
  const currentTheme = app.useStore((state) => state.currentTheme);

  React.useEffect(() => {
    services.getThemes().then((data) => setThemes(data));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-center gap-2">
        <MdColorLens size={32} />
        <span className="text-xl">Themes</span>
      </div>
      <div className="flex flex-col gap-4">
        {!viewCreate && (
          <Button onClick={() => setViewCreate(true)}>
            <MdAddCircle size={24} />
            <span>Add a theme</span>
          </Button>
        )}
        {viewCreate && currentTheme && (
          <CreateThemeView
            theme={currentTheme}
            hide={() => setViewCreate(false)}
          />
        )}
        <div className="flex flex-col gap-2">
          {themes &&
            themes
              .sort((a, b) => (a.default ? 1 : 0) - (b.default ? 1 : 0))
              .map((theme) => <ThemeView key={theme.id} theme={theme} />)}
        </div>
      </div>
    </div>
  );
};

export default ThemeSection;
