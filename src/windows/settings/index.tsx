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

import { Titlebar, Button } from "@/components";
import TimerView from "./TimerView";
import AudioView from "./audioView";
import ThemesView from "./themesView";
import ScriptsView from "./scriptsView";
import AboutView from "./AboutView";
import WindowContainer from "@/components/WindowContainer";
import useStore from "@/store";
import { useEvents } from "@/hooks";

type Tab = "timer" | "audio" | "themes" | "scripts" | "about";

export type ColorType = "window" | "base" | "primary" | "text";

const SettingsWindow: React.FC = () => {
  const [tab, setTab] = React.useState<Tab>("timer");
  const store = useStore();

  useEvents({
    interface_config_updated: (data) => store.setInterfaceConfig(data),
  });

  return (
    <WindowContainer>
      <div className="grow flex flex-col gap-0.5">
        <Titlebar icon={<MdSettings size={24} />} title="Settings" />

        <div className="grow flex flex-col gap-0.5">
          <Navbar tab={tab} setTab={setTab} />
          <div className="relative grow flex flex-col rounded-none rounded-b overflow-clip">
            {tab === "timer" ? <TimerView /> : null}
            {tab === "audio" ? <AudioView /> : null}
            {tab === "themes" ? <ThemesView /> : null}
            {tab === "scripts" ? <ScriptsView /> : null}
            {tab === "about" ? <AboutView /> : null}
          </div>
        </div>
      </div>
    </WindowContainer>
  );
};

interface NavbarProps {
  tab: Tab;
  setTab: React.Dispatch<React.SetStateAction<Tab>>;
}

const Navbar: React.FC<NavbarProps> = ({ tab, setTab }) => {
  const [osType, setOsType] = React.useState<OsType>();

  React.useEffect(() => {
    type().then((type) => setOsType(type));
  }, []);

  return (
    <div className="flex flex-col justify-between window bg-window overflow-y-auto">
      {/* <div className="max-h-0 overflow-y rounded"> */}
      <div className="flex flex-row gap-1 p-1">
        <Button isSelected={tab === "timer"} onClick={() => setTab("timer")}>
          <MdTimer size={24} />
        </Button>
        <Button isSelected={tab === "audio"} onClick={() => setTab("audio")}>
          <MdAudiotrack size={24} />
        </Button>
        <Button isSelected={tab === "themes"} onClick={() => setTab("themes")}>
          <MdColorLens size={24} />
        </Button>
        {osType !== "Windows_NT" ? (
          <Button
            isSelected={tab === "scripts"}
            onClick={() => setTab("scripts")}
          >
            <AiFillCode size={24} />
          </Button>
        ) : null}
        <Button isSelected={tab === "about"} onClick={() => setTab("about")}>
          <MdInfo size={24} />
        </Button>
      </div>
      {/* </div> */}
    </div>
  );
};

export default SettingsWindow;
