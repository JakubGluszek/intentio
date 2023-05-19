import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";

import { Button } from "./buttons";
import { Tooltip } from "./Tooltip";

interface PaneHeadingProps {
  body: string | React.ReactNode;
  onExit: () => void;
}

export const PaneHeading: React.FC<PaneHeadingProps> = (props) => {
  return (
    <div className="bg-base/20 p-0.5 rounded-sm">
      <div className="flex flex-row items-center gap-1">
        <Tooltip label="Return">
          <Button variant="ghost" onClick={() => props.onExit()}>
            <IoMdArrowRoundBack size={24} />
          </Button>
        </Tooltip>
        <div className="w-full font-semibold text-text/90">{props.body}</div>
      </div>
    </div>
  );
};
