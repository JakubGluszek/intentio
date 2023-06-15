import React from "react";

import config from "@/config";
import { SiDiscord } from "react-icons/si";
import { IoIosBug, IoIosGlobe, IoLogoGithub } from "react-icons/io";
import { Pane, Tooltip, Button } from "@/ui";
import IntentioLogo from "./IntentioLogo";

const AboutPane: React.FC = () => {
  return (
    <Pane className="grow flex flex-col justify-between" padding="lg">
      <div className="text-primary text-center translate-y-12">
        <IntentioLogo />
        <div className="-translate-y-3 text-text/80">
          A pomodoro app for your needs.
        </div>
        <div className="text-text/80 font-semibold">
          Version: <span className="text-primary/80">2.0.0 (BETA)</span>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-1">
          <Tooltip classNames={{ tooltip: "tooltip" }} label="Home page">
            <a
              className="mr-auto"
              tabIndex={-2}
              href={config.about.homePage}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="ghost">
                <IoIosGlobe size={28} />
              </Button>
            </a>
          </Tooltip>
          <Tooltip label="Discord server" classNames={{ tooltip: "tooltip" }}>
            <a
              className="mr-auto"
              tabIndex={-2}
              href={config.about.discordServer}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="ghost">
                <SiDiscord size={28} />
              </Button>
            </a>
          </Tooltip>
        </div>

        <div className="flex flex-row gap-1">
          <Tooltip label="Source code" classNames={{ tooltip: "tooltip" }}>
            <a
              tabIndex={-2}
              href={config.about.sourceCode}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="ghost">
                <IoLogoGithub size={26} />
              </Button>
            </a>
          </Tooltip>
          <Tooltip label="Report a bug" classNames={{ tooltip: "tooltip" }}>
            <a
              tabIndex={-2}
              href={config.about.sourceCode + "/issues"}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="ghost">
                <IoIosBug size={28} />
              </Button>
            </a>
          </Tooltip>
        </div>
      </div>
    </Pane>
  );
};

export default AboutPane;
