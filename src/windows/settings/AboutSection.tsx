import React from "react";
import { MdInfoOutline } from "react-icons/md";
import { IoIosBug, IoIosGlobe, IoLogoGithub } from "react-icons/io";
import { Tooltip } from "@mantine/core";

interface AboutData {
  version: string;
  sourceCode: string;
  homePage: string;
}

const AboutSection: React.FC = () => {
  const [data, setData] = React.useState<AboutData>();

  React.useEffect(() => {
    fetch("about.json").then((res) => res.json().then((data) => setData(data)));
  }, []);

  if (!data) return null;

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
              <span>{data?.version}</span>
            </div>
          </Tooltip>
        </div>
        <div className="w-2/3 flex flex-row items-center justify-between">
          <Tooltip withArrow label="Home page">
            <a href={data.homePage} target="_blank">
              <button className="btn btn-ghost">
                <IoIosGlobe size={42} />
              </button>
            </a>
          </Tooltip>
          <Tooltip withArrow label="Source code">
            <a href={data.sourceCode} target="_blank">
              <button className="btn btn-ghost">
                <IoLogoGithub size={40} />
              </button>
            </a>
          </Tooltip>
          <Tooltip withArrow label="Report a bug">
            <a href={data.sourceCode + "/issues"} target="_blank">
              <button className="btn btn-ghost">
                <IoIosBug size={42} />
              </button>
            </a>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
