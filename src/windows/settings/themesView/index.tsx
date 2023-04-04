import React from "react";

import useStore from "@/store";
import ipc from "@/ipc";
import { Button } from "@/components";
import { MdAddCircle, MdArrowBack, MdRestartAlt } from "react-icons/md";
import { Theme } from "@/bindings/Theme";
import ThemeView from "./ThemeView";

type ThemeStates =
  | "idle_theme_id"
  | "focus_theme_id"
  | "break_theme_id"
  | "long_break_theme_id";

const ThemesView: React.FC = () => {
  const [viewThemesCollection, setViewThemesCollection] = React.useState(false);
  const [editTheme, setEditTheme] = React.useState<Theme | null>(null);
  const [viewCreate, setViewCreate] = React.useState(false);
  const [viewThemeSelection, setViewThemeSelection] =
    React.useState<ThemeStates | null>(null);

  const store = useStore();

  React.useEffect(() => {
    ipc.getThemes().then((data) => store.setThemes(data));
    ipc.getInterfaceConfig().then((data) => store.setInterfaceConfig(data));
  }, []);

  if (viewThemesCollection)
    return <ThemesCollection onHide={() => setViewThemesCollection(false)} />;

  if (editTheme) return <EditTheme onHide={() => setEditTheme(null)} />;

  if (viewCreate) return <CreateTheme onHide={() => setViewCreate(false)} />;

  if (viewThemeSelection)
    return (
      <ThemeSelection
        configKey={viewThemeSelection}
        themes={store.themes}
        onThemeSelected={(theme) => {
          ipc
            .updateInterfaceConfig({ [viewThemeSelection]: theme.id })
            .then(() => setViewThemeSelection(null));
        }}
        onEditTheme={(theme) => setEditTheme(theme)}
        onHide={() => setViewThemeSelection(null)}
      />
    );

  if (
    !store.interfaceConfig ||
    !store.currentTheme ||
    store.themes.length === 0
  )
    return null;

  return (
    <div className="grow flex flex-col gap-0.5">
      <div className="flex flex-col window bg-window">
        <Button onClick={() => setViewThemesCollection(true)} transparent>
          View themes
        </Button>
      </div>
      <div className="grow flex flex-col p-1.5 gap-1 window bg-window">
        <ThemeState
          onClick={() => setViewThemeSelection("idle_theme_id")}
          label="Idle"
          theme={store.getIdleTheme()!}
        />
        <ThemeState
          onClick={() => setViewThemeSelection("focus_theme_id")}
          label="Focus"
          theme={store.getFocusTheme()!}
        />
        <ThemeState
          onClick={() => setViewThemeSelection("break_theme_id")}
          label="Break"
          theme={store.getBreakTheme()!}
        />
        <ThemeState
          onClick={() => setViewThemeSelection("long_break_theme_id")}
          label="Long break"
          theme={store.getLongBreakTheme()!}
        />
      </div>
    </div>
  );
};

interface ThemeSelectionProps {
  configKey: ThemeStates;
  onThemeSelected: (theme: Theme) => void;
  themes: Theme[];
  onHide: () => void;
  onEditTheme: (theme: Theme) => void;
}

const ThemeSelection: React.FC<ThemeSelectionProps> = (props) => {
  const label = transformConfigKeyIntoLabel(props.configKey);

  return (
    <div className="grow flex flex-col gap-0.5">
      <div className="h-fit flex flex-row gap-0.5">
        <div className="window bg-window">
          <Button onClick={() => props.onHide()} transparent rounded={false}>
            <MdArrowBack size={24} />
          </Button>
        </div>
        <div className="grow window bg-window flex flex-row items-center px-1.5">
          {label}
        </div>
      </div>
      <div className="grow flex flex-col window bg-window overflow-y-auto">
        <div className="max-h-0 overflow-y">
          <div className="flex flex-col gap-1.5 p-1.5">
            {props.themes.map((theme) => (
              <ThemeView
                key={theme.id}
                data={theme}
                onViewEdit={() => props.onEditTheme(theme)}
                onSelected={() => props.onThemeSelected(theme)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ThemeStateProps {
  label: string;
  theme: Theme;
  onClick: () => void;
}

const ThemeState: React.FC<ThemeStateProps> = (props) => {
  return (
    <div
      onClick={() => props.onClick()}
      className="relative card flex flex-row p-0 gap-2"
      data-tauri-disable-drag
      style={{
        color: props.theme.text_hex,
        backgroundColor: props.theme.window_hex,
        borderColor: props.theme.base_hex,
      }}
    >
      <div
        style={{
          width: 40,
          height: "100%",
          backgroundColor: props.theme.primary_hex,
        }}
      ></div>
      <div className="py-1">{props.label}</div>
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

interface ThemesCollectionProps {
  onHide: () => void;
}

const ThemesCollection: React.FC<ThemesCollectionProps> = (props) => {
  return (
    <div className="grow flex flex-col gap-0.5">
      <div className="h-fit flex flex-row gap-0.5">
        <div className="window bg-window">
          <Button onClick={() => props.onHide()} transparent rounded={false}>
            <MdArrowBack size={24} />
          </Button>
        </div>
        <div className="grow window bg-window flex flex-row items-center justify-between">
          <Button transparent rounded={false}>
            <MdAddCircle size={20} />
            <div>Add theme</div>
          </Button>
          <Button transparent rounded={false}>
            <MdRestartAlt size={24} />
          </Button>
        </div>
      </div>
      <div className="grow flex flex-col window bg-window p-1.5"></div>
    </div>
  );
};

function transformConfigKeyIntoLabel(key: ThemeStates): string {
  let label = "";
  switch (key) {
    case "idle_theme_id":
      label = "Idle";
      break;
    case "focus_theme_id":
      label = "Focus";
      break;
    case "break_theme_id":
      label = "Break";
      break;
    case "long_break_theme_id":
      label = "Long break";
      break;
  }
  return label;
}

export default ThemesView;
