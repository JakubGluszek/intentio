import React from "react";
import {
  MdAddCircle,
  MdFavorite,
  MdFavoriteBorder,
  MdInfo,
} from "react-icons/md";

import useStore from "@/store";
import ipc from "@/ipc";
import { Button } from "@/components";
import { Theme } from "@/bindings/Theme";
import EditTheme from "./EditTheme";
import CreateTheme from "./CreateTheme";
import ThemesInfo from "./ThemesInfo";
import ThemesList from "./ThemesList";
import ThemeSelection from "./ThemeSelection";

const ThemesView: React.FC = () => {
  const [editTheme, setEditTheme] = React.useState<Theme | null>(null);
  const [viewCreate, setViewCreate] = React.useState(false);
  const [viewInfo, setViewInfo] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState<Theme | null>(null);
  const [favoriteOnly, setFavoriteOnly] = React.useState(false);
  const store = useStore();

  React.useEffect(() => {
    ipc.getThemes().then((data) => store.setThemes(data));
    ipc.getInterfaceConfig().then((data) => store.setInterfaceConfig(data));
  }, []);

  if (editTheme) return <EditTheme onHide={() => setEditTheme(null)} />;
  if (viewCreate) return <CreateTheme onHide={() => setViewCreate(false)} />;
  if (viewInfo) return <ThemesInfo onHide={() => setViewInfo(false)} />;
  if (selectedTheme)
    return <ThemeSelection onHide={() => setSelectedTheme(null)} />;

  return (
    <div className="grow flex flex-col gap-0.5">
      <div className="flex flex-row justify-between window bg-window p-0.5">
        <Button
          onClick={() => setViewCreate(true)}
          transparent
          rounded={false}
          highlight={false}
        >
          <MdAddCircle size={20} />
          <div>Add theme</div>
        </Button>
        <div className="flex flex-row">
          <Button
            onClick={() => setFavoriteOnly((prev) => !prev)}
            transparent
            rounded={false}
            highlight={false}
          >
            {favoriteOnly ? (
              <MdFavorite size={24} />
            ) : (
              <MdFavoriteBorder size={24} />
            )}
          </Button>
          <Button
            onClick={() => setViewInfo(true)}
            transparent
            rounded={false}
            highlight={false}
          >
            <MdInfo size={24} />
          </Button>
        </div>
      </div>
      <ThemesList
        themes={store.themes}
        viewFavoriteOnly={favoriteOnly}
        onThemeViewEdit={(theme) => setEditTheme(theme)}
        onThemeSelected={(theme) => setSelectedTheme(theme)}
      />
    </div>
  );
};

export default ThemesView;
