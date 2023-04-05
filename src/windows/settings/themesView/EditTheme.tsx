import React from "react";
import { MdArrowBack } from "react-icons/md";

import { Button } from "@/components";

interface Props {
  onHide: () => void;
}

const EditTheme: React.FC<Props> = (props) => {
  return (
    <div className="grow flex flex-col gap-0.5">
      <div className="h-fit flex flex-row gap-0.5">
        <div className="window bg-window">
          <Button onClick={() => props.onHide()} transparent rounded={false}>
            <MdArrowBack size={24} />
          </Button>
        </div>
        <div className="grow window bg-window flex flex-row items-center px-2">
          Edit theme
        </div>
      </div>
      <div className="grow flex flex-col window bg-window p-1.5"></div>
    </div>
  );
};

export default EditTheme;
