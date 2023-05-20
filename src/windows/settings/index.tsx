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
import { Pane, Tabs, Titlebar } from "@/ui";
import { useEvents } from "@/hooks";
import { WindowContainer } from "@/components";

import TimerPane from "./timerPane";
import AudioPane from "./audioPane";
import ThemesPane from "./themesPane";
import GeneralPane from "./generalPane";
import ScriptsPane from "./scriptsPane";
import AccountPane from "./accountPane";
import AboutPane from "./aboutPane";

export type ColorType = "window" | "base" | "primary" | "text";

const SettingsWindow: React.FC = () => {
  const store = useStore();

  useEvents({
    theme_deleted: (data) => store.removeTheme(data.id),
  });

  return (
    <SettingsWindowProvider>
      <WindowContainer>
        <div className="grow flex flex-col gap-0.5">
          <SettingsTitlebar />
          <Navbar />
          <div className="grow flex flex-col gap-0.5">
            <Content />
          </div>
        </div>
      </WindowContainer>
    </SettingsWindowProvider>
  );
};

const SettingsTitlebar: React.FC = () => {
  const { panel } = React.useContext(SettingsWindowContext)!;

  return <Titlebar icon={MdSettings} title={`Settings | ${panel}`} />;
};

const Content: React.FC = () => {
  const { panel } = React.useContext(SettingsWindowContext)!;

  return (
    <div className="grow flex flex-col">
      {panel === "Timer" ? <TimerPane /> : null}
      {panel === "Audio" ? <AudioPane /> : null}
      {panel === "Themes" ? <ThemesPane /> : null}
      {panel === "General" ? <GeneralPane /> : null}
      {panel === "Scripts" ? <ScriptsPane /> : null}
      {panel === "Account" ? <AccountPane /> : null}
      {panel === "About" ? <AboutPane /> : null}
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
    <Pane>
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
