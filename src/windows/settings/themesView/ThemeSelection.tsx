import React from "react";
import { MdArrowBack } from "react-icons/md";

import { Button } from "@/components";
import { Theme } from "@/bindings/Theme";

interface Props {
  data: Theme;
  onHide: () => void;
}

const ThemeConfig: React.FC<Props> = (props) => {
  return (
    <div className="grow flex flex-col gap-0.5">
      <div className="h-fit flex flex-row gap-0.5">
        <div className="window bg-window">
          <Button onClick={() => props.onHide()} transparent rounded={false}>
            <MdArrowBack size={24} />
          </Button>
        </div>
        <div className="grow window bg-window flex flex-row items-center px-2 text-text/70">
          Toggle theme usage.
        </div>
      </div>
      <div className="grow flex flex-col window bg-window p-1.5"></div>
    </div>
  );
};

export default ThemeConfig;
