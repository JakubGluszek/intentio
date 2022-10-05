import React from "react";
import { MdInfoOutline } from "react-icons/md";

const AboutSection: React.FC = () => {
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
            <span>0.0.0</span>
          </div>
        </div>
        <div className="group card flex flex-col items-center gap-2">
          <span>Author</span>
          <div className="bg-base group-hover:bg-window rounded px-2 py-1">
            <span>Jakub Głuszek</span>
          </div>
          <div className="bg-base group-hover:bg-window rounded px-2 py-1">
            <span>jacobgluszek03@gmail.com</span>
          </div>
        </div>
        <div className="group card flex flex-col items-center gap-2">
          <span>Source Code</span>
          <div className="bg-base group-hover:bg-window rounded px-2 py-1">
            <span>Github</span>
          </div>
        </div>
        <div className="flex flex-row items-center justify-evenly gap-4">
          <button className="btn btn-ghost">Provide feedback</button>
          <button className="btn btn-ghost">Report a bug</button>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
