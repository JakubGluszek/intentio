import React from "react";
import { MdAddCircle } from "react-icons/md";

import { Button, IconView } from "@/ui";

export const TasksView: React.FC = () => {
  return (
    <>
      <nav className="h-8 flex flex-row gap-0.5 rounded-[1px] overflow-clip">
        {/* Heading */}
        <div className="flex-1 flex flex-row items-center gap-1 px-1 text-text/80 bg-base/5 border border-base/5">
          <span className="font-bold uppercase text-lg">Tasks</span>
        </div>
        {/* Button Bar */}
        <div className="w-fit flex flex-row items-center px-2 gap-2 bg-base/5 border border-base/5">
          <Button onClick={() => null} variant="ghost">
            <IconView icon={MdAddCircle} />
          </Button>
        </div>
      </nav>

      <div className="grow flex flex-col gap-1"></div>
    </>
  );
};
