import React from "react";

import useStore from "@/store";
import ipc from "@/ipc";
import { Button } from "@/components";
import { MdArrowBack } from "react-icons/md";
import { Theme } from "@/bindings/Theme";

const ThemesView: React.FC = () => {
  const [editTheme, setEditTheme] = React.useState<Theme | null>(null);
  const [viewCreate, setViewCreate] = React.useState(false);
  const store = useStore();

  React.useEffect(() => {
    ipc.getThemes().then((data) => store.setThemes(data));
    ipc.getInterfaceConfig().then((data) => store.setInterfaceConfig(data));
  }, []);

  if (editTheme) return <EditTheme onHide={() => setEditTheme(null)} />;
  if (viewCreate) return <CreateTheme onHide={() => setViewCreate(false)} />;

  return (
    <div className="grow flex flex-col gap-0.5">
      <div className="grow flex flex-col gap-1.5 window bg-window"></div>
    </div>
  );
};

interface CreateThemeProps {
  onHide: () => void;
}

const CreateTheme: React.FC<CreateThemeProps> = (props) => {
  return (
    <div className="grow flex flex-col gap-0.5">
      <div className="h-fit flex flex-row gap-0.5">
        <div className="window bg-window">
          <Button onClick={() => props.onHide()} transparent rounded={false}>
            <MdArrowBack size={24} />
          </Button>
        </div>
        <div className="grow window bg-window flex flex-row items-center px-2">
          Create theme
        </div>
      </div>
      <div className="grow flex flex-col window bg-window p-1.5"></div>
    </div>
  );
};

interface EditThemeProps {
  onHide: () => void;
}

const EditTheme: React.FC<EditThemeProps> = (props) => {
  return (
    <div className="grow flex flex-col gap-0.5">
      <div className="h-fit flex flex-row gap-0.5">
        <div className="window bg-window">
          <Button onClick={() => props.onHide()} transparent rounded={false}>
            <MdArrowBack size={24} />
          </Button>
        </div>
        <div className="grow window bg-window flex flex-row items-center px-2">
          Edit theme
        </div>
      </div>
      <div className="grow flex flex-col window bg-window p-1.5"></div>
    </div>
  );
};

export default ThemesView;
