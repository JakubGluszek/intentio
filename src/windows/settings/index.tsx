import React from "react";
import {
  MdAccountCircle,
  MdAudiotrack,
  MdColorLens,
  MdInfo,
  MdSettings,
  MdTimer,
  MdWindow,
} from "react-icons/md";
import { FiCommand } from "react-icons/fi";
import { OsType, type } from "@tauri-apps/api/os";

import useStore from "@/store";
import { useEvents } from "@/hooks";
import { Titlebar, WindowContainer } from "@/components";
import TimerView from "./TimerView";
import AudioView from "./audioView";
import ThemesView from "./themesView";
import ScriptsView from "./scriptsView";
import AboutView from "./AboutView";
import {
  SettingsWindowContext,
  SettingsWindowProvider,
} from "@/contexts/settingsWindowContext";
import { VscTerminalBash } from "react-icons/vsc";
import { Tabs } from "@/ui";

export type ColorType = "window" | "base" | "primary" | "text";

const SettingsWindow: React.FC = () => {
  const store = useStore();

  useEvents({
    interface_config_updated: (data) => store.setInterfaceConfig(data),
    theme_deleted: (data) => store.removeTheme(data.id),
  });

  return (
    <SettingsWindowProvider>
      <WindowContainer>
        <div className="grow flex flex-col gap-0.5">
          <SettingsTitlebar />
          <div className="grow flex flex-col gap-0.5">
            <Navbar />
            <Content />
          </div>
        </div>
      </WindowContainer>
    </SettingsWindowProvider>
  );
};

const SettingsTitlebar: React.FC = () => {
  const { panel } = React.useContext(SettingsWindowContext)!;

  return <Titlebar icon={<MdSettings size={24} />} title={`${panel}`} />;
};

const Content: React.FC = () => {
  const { panel } = React.useContext(SettingsWindowContext)!;

  return (
    <div className="relative grow flex flex-col overflow-clip rounded-b">
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
    <div className="flex flex-col justify-between window bg-window overflow-y-auto">
      <Tabs value={panel} onChange={(value) => setPanel(value)}>
        <Tabs.Tab value="Timer">
          <MdTimer size={24} />
        </Tabs.Tab>
        <Tabs.Tab value="Audio">
          <MdAudiotrack size={24} />
        </Tabs.Tab>
        <Tabs.Tab value="Themes">
          <MdColorLens size={24} />
        </Tabs.Tab>
        <Tabs.Tab value="Windows">
          <MdWindow size={24} />
        </Tabs.Tab>
        <Tabs.Tab value="Hotkeys">
          <FiCommand size={24} />
        </Tabs.Tab>
        {osType !== "Windows_NT" && (
          <Tabs.Tab value="Scripts">
            <VscTerminalBash size={24} />
          </Tabs.Tab>
        )}
        <Tabs.Tab value="Account">
          <MdAccountCircle size={24} />
        </Tabs.Tab>
        <Tabs.Tab value="About">
          <MdInfo size={24} />
        </Tabs.Tab>
      </Tabs>
    </div>
  );
};

export default SettingsWindow;
