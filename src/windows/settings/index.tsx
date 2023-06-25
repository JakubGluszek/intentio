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

import { Pane, Panels, Titlebar } from "@/ui";
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
  return (
    <SettingsWindowProvider>
      <WindowContainer>
        <div className="w-screen h-screen flex flex-col gap-0.5">
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
      <Panels value={panel} onChange={(value) => setPanel(value)}>
        <Panels.Panel value="Timer">
          <MdTimer size={24} />
        </Panels.Panel>
        <Panels.Panel value="Audio">
          <MdAudiotrack size={24} />
        </Panels.Panel>
        <Panels.Panel value="Themes">
          <MdColorLens size={24} />
        </Panels.Panel>
        <Panels.Panel value="General">
          <VscSettings size={24} />
        </Panels.Panel>
        {osType !== "Windows_NT" && (
          <Panels.Panel value="Scripts">
            <VscTerminalBash size={24} />
          </Panels.Panel>
        )}
        <Panels.Panel value="Account">
          <MdAccountCircle size={24} />
        </Panels.Panel>
        <Panels.Panel value="About">
          <MdInfo size={24} />
        </Panels.Panel>
      </Panels>
    </Pane>
  );
};

export default SettingsWindow;
