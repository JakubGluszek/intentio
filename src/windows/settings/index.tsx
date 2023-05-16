import React from "react";
import {
  MdAccountCircle,
  MdAudiotrack,
  MdClose,
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
import { Button, Pane, Tabs } from "@/ui";
import { useEvents } from "@/hooks";
import { WindowContainer } from "@/components";
import TimerView from "./TimerView";
import AudioView from "./audioView";
import ThemesView from "./themesView";
import ScriptsView from "./scriptsView";
import AboutView from "./AboutView";
import GeneralView from "./GeneralView";
import AccountView from "./AccountView";
import { appWindow } from "@tauri-apps/api/window";

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

  return (
    <Pane className="flex flex-col gap-1">
      <div className="flex flex-row  items-center justify-between">
        <div className="flex flex-row items-center gap-1 text-text">
          <MdSettings size={24} />
          <span className="text-lg font-semibold">{panel}</span>
        </div>
        <Button variant="ghost" onClick={() => appWindow.close()}>
          <MdClose size={28} />
        </Button>
      </div>
      <Navbar />
    </Pane>
  );
};

const Content: React.FC = () => {
  const { panel } = React.useContext(SettingsWindowContext)!;

  return (
    <div className="grow flex flex-col">
      {panel === "Timer" ? <TimerView /> : null}
      {panel === "Audio" ? <AudioView /> : null}
      {panel === "Themes" ? <ThemesView /> : null}
      {panel === "General" ? <GeneralView /> : null}
      {panel === "Scripts" ? <ScriptsView /> : null}
      {panel === "Account" ? <AccountView /> : null}
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
  );
};

export default SettingsWindow;
