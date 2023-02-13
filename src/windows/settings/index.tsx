import React from "react";
import {
  MdColorLens,
  MdInfo,
  MdNotifications,
  MdSettings,
  MdTimer,
} from "react-icons/md";
import { RiToolsFill } from "react-icons/ri";
import { AiFillCode } from "react-icons/ai";
import { IoIosBug, IoIosGlobe, IoLogoGithub } from "react-icons/io";
import { Tooltip } from "@mantine/core";

import useStore from "@/store";
import config from "@/config";
import services from "@/services";
import { Layout, Button } from "@/components";
import { SettingsForUpdate } from "@/bindings/SettingsForUpdate";
import TimerView from "./TimerView";
import AlertsView from "./AlertsView";
import AppearanceView from "./appearanceView";
import BehaviorView from "./BehaviorView";
import ScriptsView from "./scriptsView";

type Tab = "timer" | "alerts" | "appearance" | "behavior" | "scripts" | "about";

export type ColorType = "window" | "base" | "primary" | "text";

const SettingsWindow: React.FC = () => {
  const [tab, setTab] = React.useState<Tab>("timer");

  const settings = useStore((state) => state.settings);
  const setSettings = useStore((state) => state.setSettings);

  const update = async (data: Partial<SettingsForUpdate>) => {
    const result = await services.updateSettings(data);
    setSettings(result);
    return result;
  };

  if (!settings) return null;

  return (
    <Layout label="Settings" icon={<MdSettings size={28} />}>
      <div className="grow flex flex-row">
        {/* Sidebar */}
        <div className="w-[176px] flex flex-col justify-between p-2">
          {/* Navigation */}
          <div className="flex flex-col gap-1.5 rounded">
            <Button
              className="transition-transform hover:-translate-y-0.5 hover:shadow"
              color={tab === "timer" ? "primary" : "base"}
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
              className="transition-transform hover:-translate-y-0.5 hover:shadow"
              color={tab === "alerts" ? "primary" : "base"}
              onClick={() => setTab("alerts")}
            >
              <div className="w-full flex flex-row gap-1">
                <div className="w-6">
                  <MdNotifications size={24} />
                </div>
                Alerts
              </div>
            </Button>
            <Button
              className="transition-transform hover:-translate-y-0.5 hover:shadow"
              color={tab === "appearance" ? "primary" : "base"}
              onClick={() => setTab("appearance")}
            >
              <div className="w-full flex flex-row gap-1">
                <div className="w-6">
                  <MdColorLens size={24} />
                </div>
                Appearance
              </div>
            </Button>
            <Button
              className="shadow transition-transform hover:-translate-y-0.5 hover:shadow-2xl"
              color={tab === "behavior" ? "primary" : "base"}
              onClick={() => setTab("behavior")}
            >
              <div className="w-full flex flex-row gap-1">
                <div className="w-6">
                  <RiToolsFill size={24} />
                </div>
                Behavior
              </div>
            </Button>
            <Button
              className="shadow transition-transform hover:-translate-y-0.5 hover:shadow-2xl"
              color={tab === "scripts" ? "primary" : "base"}
              onClick={() => setTab("scripts")}
            >
              <div className="w-full flex flex-row gap-1">
                <div className="w-6">
                  <AiFillCode size={24} />
                </div>
                Scripts
              </div>
            </Button>

            <Button
              className="shadow transition-transform hover:-translate-y-0.5 hover:shadow-2xl"
              color={tab === "about" ? "primary" : "base"}
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
          {/* About */}
          <div className="flex flex-row items-center justify-end gap-1">
            <Tooltip withArrow label="Home page">
              <a
                className="mr-auto"
                tabIndex={-2}
                href={config.about.homePage}
                target="_blank"
                rel="noreferrer"
              >
                <Button transparent>
                  <IoIosGlobe size={24} />
                </Button>
              </a>
            </Tooltip>
            <Tooltip withArrow label="Source code">
              <a
                tabIndex={-2}
                href={config.about.sourceCode}
                target="_blank"
                rel="noreferrer"
              >
                <Button transparent>
                  <IoLogoGithub size={22} />
                </Button>
              </a>
            </Tooltip>
            <Tooltip withArrow label="Report a bug">
              <a
                tabIndex={-2}
                href={config.about.sourceCode + "/issues"}
                target="_blank"
                rel="noreferrer"
              >
                <Button transparent>
                  <IoIosBug size={24} />
                </Button>
              </a>
            </Tooltip>
          </div>
        </div>
        {/* Main */}
        <div className="relative grow flex flex-col p-2 pl-0">
          <div className="grow bg-darker/20 shadow-inner rounded p-2.5 overflow-y-auto">
            <div className="max-h-0 overflow-y">
              {tab === "timer" ? (
                <TimerView settings={settings} update={update} />
              ) : null}
              {tab === "alerts" ? (
                <AlertsView settings={settings} update={update} />
              ) : null}
              {tab === "appearance" ? (
                <AppearanceView settings={settings} update={update} />
              ) : null}
              {tab === "behavior" ? (
                <BehaviorView settings={settings} update={update} />
              ) : null}
              {tab === "scripts" ? (
                <ScriptsView settings={settings} update={update} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsWindow;
