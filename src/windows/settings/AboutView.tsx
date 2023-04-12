import React from "react";

import config from "@/config";
import { Button, IntentioLogo } from "@/components";
import { Tooltip } from "@mantine/core";
import { SiDiscord } from "react-icons/si";
import { IoIosBug, IoIosGlobe, IoLogoGithub } from "react-icons/io";

const AboutView: React.FC = () => {
  return (
    <div className="grow flex flex-col justify-between text-text/80 window bg-window">
      <div className="flex-1 text-primary">
        <IntentioLogo />
        <div className="text-center text-sm -translate-y-3 text-text/80">
          A pomodoro app for&nbsp;
          <span className="text-primary/80 font-bold">your</span> needs.
        </div>
      </div>
      <div className="flex flex-col gap-1.5 text-center p-2">
        <div>
          <span>Version: </span>
          <span className="text-primary/80 font-bold">
            {config.about.version}
          </span>
        </div>
        <div>
          <span>Author: </span>
          <a
            className="text-primary/80 font-bold"
            tabIndex={-2}
            href={config.about.authorHomepage}
            target="_blank"
            rel="noreferrer"
          >
            {config.about.author}
          </a>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between p-2">
        <div className="flex flex-row gap-1">
          <Tooltip withArrow label="Home page">
            <a
              className="mr-auto"
              tabIndex={-2}
              href={config.about.homePage}
              target="_blank"
              rel="noreferrer"
            >
              <Button transparent highlight={false}>
                <IoIosGlobe size={28} />
              </Button>
            </a>
          </Tooltip>
          <Tooltip withArrow label="Discord server">
            <a
              className="mr-auto"
              tabIndex={-2}
              href={config.about.discordServer}
              target="_blank"
              rel="noreferrer"
            >
              <Button transparent highlight={false}>
                <SiDiscord size={28} />
              </Button>
            </a>
          </Tooltip>
        </div>

        <div className="flex flex-row gap-1">
          <Tooltip withArrow label="Source code">
            <a
              tabIndex={-2}
              href={config.about.sourceCode}
              target="_blank"
              rel="noreferrer"
            >
              <Button transparent highlight={false}>
                <IoLogoGithub size={26} />
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
              <Button transparent highlight={false}>
                <IoIosBug size={28} />
              </Button>
            </a>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
