import React from "react";
import { MdAddCircle } from "react-icons/md";

import useStore from "@/store";
import ipc from "@/ipc";
import { Button } from "@/components";
import CreateThemeModal from "./CreateThemeModal";
import ThemeView from "./ThemeView";

const ThemesView: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);

  const store = useStore();

  React.useEffect(() => {
    ipc.getThemes().then((data) => store.setThemes(data));
    ipc.getInterfaceConfig().then((data) => store.setInterfaceConfig(data));
  }, []);

  if (!store.interfaceConfig) return null;

  return (
    <div className="grow flex flex-col gap-0.5">
      <div className="grow flex flex-col overflow-y-auto window bg-window">
        <div className="flex flex-col gap-1 p-2">
          {/* <p>Select random theme on new session (maybe)</p> */}
          <p>Select Favorite only</p>
          <p>Restore default</p>
        </div>
        <div className="max-h-0 overflow-y">
          <div className="flex flex-col gap-1.5 p-2">
            <div>
              <Button onClick={() => setViewCreate(true)}>
                <MdAddCircle size={20} />
                <span>Add theme</span>
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              {store.themes
                .sort((a, b) => (a.default ? 1 : 0) - (b.default ? 1 : 0))
                .map((theme) => (
                  <ThemeView key={theme.id} theme={theme} />
                ))}
            </div>
          </div>
        </div>
      </div>
      {/* Create theme modal popup */}
      {store.currentTheme && (
        <CreateThemeModal
          display={viewCreate}
          theme={store.currentTheme}
          hide={() => setViewCreate(false)}
        />
      )}
    </div>
  );
};

export default ThemesView;
