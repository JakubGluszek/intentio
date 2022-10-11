import React from "react";
import { MdInfoOutline } from "react-icons/md";

interface AboutData {
  version: string;
  author: {
    name: string;
    surname: string;
    email: string;
  };
  source: string;
}

const AboutSection: React.FC = () => {
  const [data, setData] = React.useState<AboutData>();

  React.useEffect(() => {
    fetch("data/about.json").then((res) =>
      res.json().then((data) => setData(data))
    );
  }, []);

  if (!data) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-center gap-2">
        <MdInfoOutline size={28} />
        <span className="text-lg">About</span>
      </div>
      <div className="flex flex-col gap-4">
        <div className="group card flex flex-col items-center gap-2">
          <span>Version</span>
          <div className="bg-base group-hover:bg-window rounded px-2 py-1">
            <span>{data?.version}</span>
          </div>
        </div>
        <div className="group card flex flex-col items-center gap-2">
          <span>Author</span>
          <div className="bg-base group-hover:bg-window rounded px-2 py-1">
            <span>{`${data.author.name} ${data.author.surname}`}</span>
          </div>
          <div className="bg-base group-hover:bg-window rounded px-2 py-1">
            <span>{data.author.email}</span>
          </div>
        </div>
        <div className="group card flex flex-col items-center gap-2">
          <span>Source Code</span>
          <div className="bg-base group-hover:bg-window rounded px-2 py-1">
            <a href={data.source} target="_blank">Github</a>
          </div>
        </div>
        <div className="flex flex-col items-center justify-evenly gap-0.5">
          <button className="btn btn-ghost">Report a bug</button>
          <button className="btn btn-ghost">Provide feedback</button>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
