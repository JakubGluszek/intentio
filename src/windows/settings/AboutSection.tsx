import React from "react";
import { MdInfoOutline } from "react-icons/md";
import { IoIosBug, IoIosGlobe, IoLogoGithub } from "react-icons/io";
import { Tooltip } from "@mantine/core";

import Button from "../../components/Button";
import { ABOUT_DATA as data } from "../../app/config";

const AboutSection: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-center gap-2">
        <MdInfoOutline size={32} />
        <span className="text-xl">About</span>
      </div>
      <div className="group card flex flex-row gap-4">
        <div className="w-1/3 flex flex-col items-center justify-center">
          <Tooltip withArrow label="Version">
            <div className="bg-base group-hover:bg-window rounded p-2">
              <span>{data.version}</span>
            </div>
          </Tooltip>
        </div>
        <div className="w-2/3 flex flex-row items-center justify-between">
          <Tooltip withArrow label="Home page">
            <a href={data.homePage} target="_blank">
              <Button transparent>
                <IoIosGlobe size={42} />
              </Button>
            </a>
          </Tooltip>
          <Tooltip withArrow label="Source code">
            <a href={data.sourceCode} target="_blank">
              <Button transparent>
                <IoLogoGithub size={40} />
              </Button>
            </a>
          </Tooltip>
          <Tooltip withArrow label="Report a bug">
            <a href={data.sourceCode + "/issues"} target="_blank">
              <Button transparent>
                <IoIosBug size={42} />
              </Button>
            </a>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
