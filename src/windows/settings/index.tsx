import React from "react";
import {
  MdAudiotrack,
  MdColorLens,
  MdInfo,
  MdSettings,
  MdTimer,
} from "react-icons/md";
import { RiToolsFill } from "react-icons/ri";
import { AiFillCode } from "react-icons/ai";
import { OsType, type } from "@tauri-apps/api/os";

import { Titlebar, Button } from "@/components";
import TimerView from "./TimerView";
import AudioView from "./AudioView";
import InterfaceView from "./interfaceView";
import BehaviorView from "./BehaviorView";
import ScriptsView from "./scriptsView";
import AboutView from "./AboutView";
import WindowContainer from "@/components/WindowContainer";

type Tab = "timer" | "audio" | "interface" | "behavior" | "scripts" | "about";

export type ColorType = "window" | "base" | "primary" | "text";

const SettingsWindow: React.FC = () => {
  const [osType, setOsType] = React.useState<OsType>();
  const [tab, setTab] = React.useState<Tab>("timer");

  React.useEffect(() => {
    type().then((type) => setOsType(type));
  }, []);

  return (
    <WindowContainer>
      <div className="grow flex flex-col gap-0.5">
        <Titlebar icon={<MdSettings size={24} />} title="Settings" />

        <div className="grow flex flex-row gap-0.5">
          {/* Sidebar */}
          <div className="min-w-[176px] flex flex-col justify-between p-1 window">
            {/* Navigation */}
            <div className="flex flex-col gap-1.5 rounded">
              <Button
                isSelected={tab === "timer"}
                onClick={() => setTab("timer")}
              >
                <div className="w-full flex flex-row gap-1">
                  <div className="w-6">
                    <MdTimer size={24} />
                  </div>
                  Timer
                </div>
              </Button>
              <Button
                isSelected={tab === "audio"}
                onClick={() => setTab("audio")}
              >
                <div className="w-full flex flex-row gap-1">
                  <div className="w-6">
                    <MdAudiotrack size={24} />
                  </div>
                  Audio
                </div>
              </Button>
              <Button
                isSelected={tab === "interface"}
                onClick={() => setTab("interface")}
              >
                <div className="w-full flex flex-row gap-1">
                  <div className="w-6">
                    <MdColorLens size={24} />
                  </div>
                  Interface
                </div>
              </Button>
              <Button
                isSelected={tab === "behavior"}
                onClick={() => setTab("behavior")}
              >
                <div className="w-full flex flex-row gap-1">
                  <div className="w-6">
                    <RiToolsFill size={24} />
                  </div>
                  Behavior
                </div>
              </Button>
              {osType !== "Windows_NT" ? (
                <Button
                  isSelected={tab === "scripts"}
                  onClick={() => setTab("scripts")}
                >
                  <div className="w-full flex flex-row gap-1">
                    <div className="w-6">
                      <AiFillCode size={24} />
                    </div>
                    Scripts
                  </div>
                </Button>
              ) : null}
              <Button
                isSelected={tab === "about"}
                onClick={() => setTab("about")}
              >
                <div className="w-full flex flex-row gap-1">
                  <div className="w-6">
                    <MdInfo size={24} />
                  </div>
                  About
                </div>
              </Button>
            </div>
          </div>
          {/* Main */}
          <div className="relative grow flex flex-col rounded overflow-clip">
                {tab === "timer" ? <TimerView /> : null}
                {tab === "audio" ? <AudioView /> : null}
                {tab === "interface" ? <InterfaceView /> : null}
                {tab === "behavior" ? <BehaviorView /> : null}
                {tab === "scripts" ? <ScriptsView /> : null}
                {tab === "about" ? <AboutView /> : null}
          </div>
        </div>
      </div>
    </WindowContainer>
  );
};

export default SettingsWindow;
