import React from "react";
import { MdCheckBox, MdStickyNote2 } from "react-icons/md";

import { Button } from "@/ui";
import { Intent } from "@/bindings/Intent";

export interface TimerIntentProps {
  data?: Intent;
}

export const TimerIntent: React.FC<TimerIntentProps> = (props) => {
  const { data } = props;

  if (!data) return null;

  return (
    <div className="relative h-10 flex flex-row items-center">
      <div className="absolute w-full h-full flex flex-row items-center justify-between">
        <div className="flex flex-row gap-0.5">
          <Button variant="ghost">
            <MdCheckBox size={24} />
          </Button>
        </div>
        <div className="flex flex-row gap-0.5">
          <Button variant="ghost">
            <MdStickyNote2 size={24} />
          </Button>
        </div>
      </div>
      <div className="w-full h-full flex flex-row items-center justify-center">
        <span className="text-text/80 font-semibold">{data.label}</span>
      </div>
    </div>
  );
};
