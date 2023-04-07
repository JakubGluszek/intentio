import React from "react";
import {
  MdAudiotrack,
  MdColorLens,
  MdInfo,
  MdSettings,
  MdTimer,
} from "react-icons/md";
import { AiFillCode } from "react-icons/ai";
import { OsType, type } from "@tauri-apps/api/os";

import useStore from "@/store";
import { useEvents } from "@/hooks";
import { Titlebar, Button, WindowContainer } from "@/components";
import TimerView from "./TimerView";
import AudioView from "./audioView";
import ThemesView from "./themesView";
import ScriptsView from "./scriptsView";
import AboutView from "./AboutView";
import {
  SettingsWindowContext,
  SettingsWindowProvider,
} from "@/contexts/settingsWindowContext";

export type ColorType = "window" | "base" | "primary" | "text";

const SettingsWindow: React.FC = () => {
  const store = useStore();

  useEvents({
    interface_config_updated: (data) => store.setInterfaceConfig(data),
    theme_updated: (data) => store.patchTheme(data.id, data),
    theme_deleted: (data) => store.removeTheme(data.id),
  });

  return (
    <SettingsWindowProvider>
      <WindowContainer>
        <div className="grow flex flex-col gap-0.5">
          <SettingsTitlebar />
          <div className="grow flex flex-col gap-0.5">
            <Content />
            <Navbar />
          </div>
        </div>
      </WindowContainer>
    </SettingsWindowProvider>
  );
};

const SettingsTitlebar: React.FC = () => {
  const { panel } = React.useContext(SettingsWindowContext)!;

  return <Titlebar icon={<MdSettings size={20} />} title={`${panel}`} />;
};

const Content: React.FC = () => {
  const { panel } = React.useContext(SettingsWindowContext)!;

  return (
    <div className="relative grow flex flex-col overflow-clip">
      {panel === "Timer" ? <TimerView /> : null}
      {panel === "Audio" ? <AudioView /> : null}
      {panel === "Themes" ? <ThemesView /> : null}
      {panel === "Scripts" ? <ScriptsView /> : null}
      {panel === "About" ? <AboutView /> : null}
    </div>
  );
};

const Navbar: React.FC = () => {
  const [osType, setOsType] = React.useState<OsType>();
  const { panel, setPanel } = React.useContext(SettingsWindowContext)!;

  React.useEffect(() => {
    type().then((type) => setOsType(type));
  }, []);

  return (
    <div className="flex flex-col justify-between window bg-window overflow-y-auto rounded-b">
      <div className="flex flex-row gap-1 p-1">
        <Button
          isSelected={panel === "Timer"}
          onClick={() => setPanel("Timer")}
        >
          <MdTimer size={24} />
        </Button>
        <Button
          isSelected={panel === "Audio"}
          onClick={() => setPanel("Audio")}
        >
          <MdAudiotrack size={24} />
        </Button>
        <Button
          isSelected={panel === "Themes"}
          onClick={() => setPanel("Themes")}
        >
          <MdColorLens size={24} />
        </Button>
        {osType !== "Windows_NT" ? (
          <Button
            isSelected={panel === "Scripts"}
            onClick={() => setPanel("Scripts")}
          >
            <AiFillCode size={24} />
          </Button>
        ) : null}
        <Button
          isSelected={panel === "About"}
          onClick={() => setPanel("About")}
        >
          <MdInfo size={24} />
        </Button>
      </div>
    </div>
  );
};

export default SettingsWindow;
