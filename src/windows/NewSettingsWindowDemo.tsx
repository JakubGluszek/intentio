import React from "react";
import {
  MdAccountCircle,
  MdAudiotrack,
  MdClose,
  MdColorLens,
  MdInfo,
  MdKeyboardCommandKey,
  MdNotifications,
  MdSettings,
  MdTimer,
} from "react-icons/md";
import { IconType } from "react-icons";
import { VscSettings } from "react-icons/vsc";
import { TbTerminal2 } from "react-icons/tb";
import { IoIosBug, IoIosGlobe, IoLogoGithub } from "react-icons/io";
import { SiDiscord } from "react-icons/si";
import { Tooltip as MantineTooltip } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { appWindow, LogicalSize } from "@tauri-apps/api/window";

import { WindowContainer } from "@/components";
import { Button, ScrollArea, Tooltip } from "@/ui";
import config from "@/config";

const NewSettingsWindowDemo: React.FC = () => {
  const [fontSize, setFontSize] = React.useState(18);

  const windowRef = React.useRef<HTMLDivElement>(null);

  const iconSize = fontSize + fontSize * 0.25;

  const updateSize = () => {
    if (!windowRef.current) return;
    let root = document.querySelector(":root");
    // @ts-ignore
    root.style.fontSize = `${fontSize}px`;
    const width = windowRef.current.clientWidth;
    const height = windowRef.current.clientHeight;
    const size = new LogicalSize(width, height);
    appWindow.setMinSize(size);
    appWindow.setMaxSize(size);
    appWindow.setSize(size);
  };

  React.useEffect(() => {
    updateSize();
  }, []);

  React.useEffect(() => {
    updateSize();
  }, [fontSize]);

  useHotkeys([
    ["ctrl+=", () => setFontSize((prev) => prev + 1)],
    ["ctrl+-", () => setFontSize((prev) => prev - 1)],
    ["ctrl+0", () => setFontSize(16)],
  ]);

  return (
    <WindowContainer>
      <div ref={windowRef} className="w-[20rem] h-[24rem]">
        <div className="w-screen h-screen flex flex-col bg-window/95 border-2 border-base/10 rounded-md overflow-clip">
          {/* Titlebar */}
          <div className="h-8 flex flex-row items-center p-0.5 bg-base/10 text-text/80">
            <div className="w-full flex flex-row items-center gap-0.5">
              <MdSettings size={iconSize} />
              <div className="font-bold text-lg">
                <span>Settings</span>
              </div>
            </div>
            <div className="flex flex-row">
              <Button variant="ghost">
                <MdClose size={iconSize} />
              </Button>
            </div>
          </div>

          <ScrollArea>
            <div className="flex flex-col gap-0.5 p-0.5">
              <div className="flex flex-col gap-1 p-1 bg-base/5 rounded-sm">
                <NavigateView
                  icon={MdTimer}
                  label={"Timer"}
                  description="Customize your focus & breaks duration, toggle auto start sessions..."
                  iconSize={iconSize}
                />
                <NavigateView
                  icon={MdAudiotrack}
                  label={"Audio"}
                  description="Select an alert to be played at the end of a session & breaks, add your own audio files..."
                  iconSize={iconSize}
                />
                <NavigateView
                  icon={MdColorLens}
                  label={"Appearance"}
                  description="Set up themes for each timer state, add custom themes, modify window scale & opacity..."
                  iconSize={iconSize}
                />
                <NavigateView
                  icon={MdNotifications}
                  label={"Notifications"}
                  description="Modify notification duration, toggle auto expire,  add custom messages..."
                  iconSize={iconSize}
                />
                <NavigateView
                  icon={VscSettings}
                  label={"General"}
                  description="Customize window behavior, toggle updates & auto start up, export your data..."
                  iconSize={iconSize}
                />
                <NavigateView
                  icon={MdKeyboardCommandKey}
                  label={"Hotkeys"}
                  description="Learn about and customize the app’s key binds, like playing or stopping the timer."
                  iconSize={iconSize}
                />
                <NavigateView
                  icon={TbTerminal2}
                  label={"Scripts"}
                  description="Create your own scripts which can be executed based on the events their bound to."
                  iconSize={iconSize}
                />
                <NavigateView
                  icon={MdAccountCircle}
                  label={"Account"}
                  description="Connect your Intentio account and unlock new features based on your subscription plan."
                  iconSize={iconSize}
                />
              </div>
              {/* About */}
              <div className="flex flex-col gap-1 p-1 bg-base/5 rounded-sm">
                <div
                  className="flex flex-col gap-1 p-1 rounded-sm"
                  data-tauri-disable-drag
                >
                  {/* Label */}
                  <div className="flex flex-row items-center gap-1">
                    <MdInfo size={iconSize} className="text-base/80" />
                    <span className="text-text/80">About</span>
                  </div>
                  <div className="flex flex-row items-center justify-between p-1 bg-window/50 rounded">
                    <div className="text-text/60">
                      Version:&nbsp;
                      <span className="text-primary font-bold">2.0.0</span>
                    </div>
                    <div className="flex flex-row gap-1">
                      <Tooltip
                        classNames={{ tooltip: "tooltip" }}
                        label="Homepage"
                      >
                        <a
                          className="mr-auto"
                          tabIndex={-2}
                          href={config.about.homePage}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button variant="ghost">
                            <IoIosGlobe size={iconSize} />
                          </Button>
                        </a>
                      </Tooltip>
                      <Tooltip
                        label="Discord server"
                        classNames={{ tooltip: "tooltip" }}
                      >
                        <a
                          className="mr-auto"
                          tabIndex={-2}
                          href={config.about.discordServer}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button variant="ghost">
                            <SiDiscord size={iconSize} />
                          </Button>
                        </a>
                      </Tooltip>

                      <Tooltip
                        label="Source code"
                        classNames={{ tooltip: "tooltip" }}
                      >
                        <a
                          tabIndex={-2}
                          href={config.about.sourceCode}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button variant="ghost">
                            <IoLogoGithub size={iconSize - 2} />
                          </Button>
                        </a>
                      </Tooltip>
                      <Tooltip
                        label="Report a bug"
                        classNames={{ tooltip: "tooltip" }}
                      >
                        <a
                          tabIndex={-2}
                          href={config.about.sourceCode + "/issues"}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button variant="ghost">
                            <IoIosBug size={iconSize} />
                          </Button>
                        </a>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </WindowContainer>
  );
};

interface NavigateViewProps {
  icon: IconType;
  label: string;
  description: string;
  iconSize: number;
}

const NavigateView: React.FC<NavigateViewProps> = (props) => {
  return (
    <div
      className="flex flex-col gap-1 p-1 bg-base/5 border border-base/5 hover:bg-primary/10 active:bg-primary/20 active:border-transparent rounded-sm shadow-black/25 shadow active:shadow-black/25 active:shadow-lg cursor-pointer transition-all duration-300"
      data-tauri-disable-drag
    >
      <div className="flex flex-row items-center justify-between text-text/80">
        <div className="flex flex-row items-center gap-1">
          <props.icon size={props.iconSize} className="text-base/80" />
          <span>{props.label}</span>
        </div>
      </div>
      <div className="flex flex-row flex-wrap p-1 bg-window/50 rounded">
        <p className="text-xs text-text/60">{props.description}</p>
      </div>
    </div>
  );
};

export default NewSettingsWindowDemo;
