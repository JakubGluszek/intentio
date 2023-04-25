import React from "react";
import {
  MdAccountCircle,
  MdAudiotrack,
  MdColorLens,
  MdInfo,
  MdSettings,
  MdTimer,
} from "react-icons/md";
import { OsType, type } from "@tauri-apps/api/os";
import {
  SettingsWindowContext,
  SettingsWindowProvider,
} from "@/contexts/settingsWindowContext";
import { VscSettings, VscTerminalBash } from "react-icons/vsc";

import useStore from "@/store";
import { Pane, Tabs } from "@/ui";
import { useEvents } from "@/hooks";
import { Titlebar, WindowContainer } from "@/components";
import TimerView from "./TimerView";
import AudioView from "./audioView";
import ThemesView from "./themesView";
import ScriptsView from "./scriptsView";
import AboutView from "./AboutView";
import GeneralView from "./GeneralView";
import AccountView from "./AccountView";

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
        <div className="grow flex flex-col gap-0.5 rounded overflow-clip">
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
    <div className="grow flex flex-col">
      {panel === "Timer" ? <TimerView /> : null}
      {panel === "Audio" ? <AudioView /> : null}
      {panel === "Themes" ? <ThemesView /> : null}
      {panel === "Scripts" ? <ScriptsView /> : null}
      {panel === "About" ? <AboutView /> : null}
      {panel === "General" ? <GeneralView /> : null}
      {panel === "Account" ? <AccountView /> : null}
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
    <Pane withPadding={false}>
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
        <Tabs.Tab value="General">
          <VscSettings size={24} />
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
    </Pane>
  );
};

export default SettingsWindow;
