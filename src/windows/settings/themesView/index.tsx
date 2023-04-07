import React from "react";
import { MdAddCircle, MdFavorite, MdFavoriteBorder } from "react-icons/md";

import useStore from "@/store";
import ipc from "@/ipc";
import { Button } from "@/components";
import { Theme } from "@/bindings/Theme";
import EditTheme from "./EditTheme";
import CreateTheme from "./CreateTheme";
import ThemesList from "./ThemesList";

type Display = "themes" | "create" | "edit";

const ThemesView: React.FC = () => {
  const [display, setDisplay] = React.useState<Display>("themes");
  const [theme, setTheme] = React.useState<Theme | null>(null);
  const [viewFavoriteOnly, setViewFavoriteOnly] = React.useState(false);
  const [selectedThemesIds, setSelectedThemesIds] = React.useState<string[]>(
    []
  );

  const store = useStore();

  React.useEffect(() => {
    ipc.getThemes().then((data) => store.setThemes(data));
    ipc.getInterfaceConfig().then((data) => store.setInterfaceConfig(data));
  }, []);

  if (display === "edit")
    return <EditTheme onHide={() => setDisplay("themes")} />;
  if (display === "create")
    return <CreateTheme onHide={() => setDisplay("themes")} />;

  return (
    <div className="grow flex flex-col gap-0.5">
      <div className="flex flex-row justify-between window bg-window p-0.5">
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

      <ThemesList
        themes={store.themes}
        selectedIds={selectedThemesIds}
        setSelectedIds={setSelectedThemesIds}
        viewFavoriteOnly={viewFavoriteOnly}
        onThemeViewEdit={(theme) => {
          setDisplay("edit");
          setTheme(theme);
        }}
      />
    </div>
  );
};

export default ThemesView;
