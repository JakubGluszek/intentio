import React from "react";
import {
  MdAccountCircle,
  MdColorLens,
  MdNotifications,
  MdSettings,
  MdTimer,
} from "react-icons/md";
import { RiToolsFill } from "react-icons/ri";
import { IoIosBug, IoIosGlobe, IoLogoGithub } from "react-icons/io";
import { Tooltip } from "@mantine/core";

import app from "@/app";
import services from "@/app/services";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { SettingsForUpdate } from "@/bindings/SettingsForUpdate";
import TimerView from "./TimerView";
import AlertsView from "./AlertsView";

type Tab = "timer" | "alerts" | "appearance" | "behavior" | "account";

const SettingsWindow: React.FC = () => {
  const [tab, setTab] = React.useState<Tab>("timer");

  const settings = app.useStore((state) => state.settings);
  const setSettings = app.useStore((state) => state.setSettings);

  const update = async (data: Partial<SettingsForUpdate>) => {
    const result = await services.updateSettings(data);
    setSettings(result);
    return result;
  };

  if (!settings) return null;

  return (
    <Layout label="Settings" icon={<MdSettings size={32} />}>
      <div className="grow flex flex-row">
        {/* Sidebar */}
        <div className="w-44 flex flex-col justify-between p-2">
          {/* Navigation */}
          <div className="flex flex-col gap-1 rounded overflow-clip">
            <Button
              opacity={tab !== "timer" ? 0.4 : undefined}
              rounded={false}
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
              opacity={tab !== "alerts" ? 0.4 : undefined}
              rounded={false}
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
              opacity={tab !== "appearance" ? 0.4 : undefined}
              rounded={false}
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
              opacity={tab !== "behavior" ? 0.4 : undefined}
              rounded={false}
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
              opacity={tab !== "account" ? 0.4 : undefined}
              rounded={false}
              onClick={() => setTab("account")}
            >
              <div className="w-full flex flex-row gap-1">
                <div className="w-6">
                  <MdAccountCircle size={24} />
                </div>
                Account
              </div>
            </Button>
          </div>
          {/* About */}
          <div className="flex flex-row items-center justify-between">
            <span className="opacity-80 font-bold">v1.1.0</span>
            <div className="flex flex-row items-center gap-1">
              <Tooltip withArrow label="Home page">
                <a
                  href={app.config.about.homePage}
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
                  href={app.config.about.sourceCode}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button transparent>
                    <IoLogoGithub size={24} />
                  </Button>
                </a>
              </Tooltip>
              <Tooltip withArrow label="Report a bug">
                <a
                  href={app.config.about.sourceCode + "/issues"}
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
        </div>
        {/* Main */}
        <div className="grow flex flex-col p-2 pl-0">
          <div className="grow bg-darker/20 inner-shadow rounded p-2 overflow-y-auto">
            <div className="max-h-0 overflow-y">
              {tab === "timer" ? (
                <TimerView settings={settings} update={update} />
              ) : null}
              {tab === "alerts" ? (
                <AlertsView settings={settings} update={update} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsWindow;
