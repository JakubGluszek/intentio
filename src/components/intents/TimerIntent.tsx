import React from "react";
import { MdCheckBox, MdStickyNote2 } from "react-icons/md";

import { Button } from "@/ui";
import { Intent } from "@/bindings/Intent";
import { BiTargetLock } from "react-icons/bi";

export interface TimerIntentProps {
  data?: Intent;
}

export const TimerIntent: React.FC<TimerIntentProps> = (props) => {
  const { data } = props;

  if (!data) return null;

  return (
    <div className="relative h-8 flex flex-row bg-base/10">
      <div className="w-full flex flex-row items-center justify-center gap-1">
        <BiTargetLock size={20} />
        <span className="text-text/80 font-semibold ">{data.label}</span>
      </div>

      <div className="absolute w-full flex flex-row items-center justify-between">
        <Button variant="ghost">
          <MdCheckBox size={24} />
        </Button>
        <Button variant="ghost">
          <MdStickyNote2 size={24} />
        </Button>
      </div>
    </div>
  );
};
