import React from "react";
import { MdCancel, MdCheckBox, MdStickyNote2 } from "react-icons/md";

import { Button, Pane } from "@/ui";
import { Intent } from "@/bindings/Intent";

export interface TimerIntentProps {
  data?: Intent;
}

export const TimerIntent: React.FC<TimerIntentProps> = (props) => {
  const { data } = props;

  if (!data) return null;

  return (
    <Pane className="relative h-10 flex flex-row p-0">
      {/* <div className="absolute w-full h-full flex flex-row items-center justify-between p-0.5"> */}
      {/*   <div className="flex flex-row gap-0.5"> */}
      {/*     <Button variant="ghost"> */}
      {/*       <MdCheckBox size={24} /> */}
      {/*     </Button> */}
      {/*   </div> */}
      {/*   <div className="flex flex-row gap-0.5"> */}
      {/*     <Button variant="ghost"> */}
      {/*       <MdStickyNote2 size={24} /> */}
      {/*     </Button> */}
      {/*   </div> */}
      {/* </div> */}
      <div className="w-full h-full flex flex-row items-center justify-center p-0.5">
        <span className="text-text/80 font-semibold">{data.label}</span>
      </div>
    </Pane>
  );
};
