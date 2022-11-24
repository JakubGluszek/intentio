import React from "react";
import { MdAddCircle, MdColorLens } from "react-icons/md";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { Theme } from "@/bindings/Theme";
import { ipc_invoke } from "@/app/ipc";
import useGlobal from "@/app/store";
import Button from "@/components/Button";
import ThemeView from "./ThemeView";
import CreateThemeView from "./CreateThemeView";

const ThemeSection: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);

  const themes = useGlobal((state) => state.themes);
  const setThemes = useGlobal((state) => state.setThemes);
  const currentTheme = useGlobal((state) => state.currentTheme);

  const [containerRef] = useAutoAnimate<HTMLDivElement>();

  React.useEffect(() => {
    ipc_invoke<Theme[]>("get_themes").then((res) => setThemes(res.data));
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
        <div ref={containerRef} className="flex flex-col gap-2">
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
