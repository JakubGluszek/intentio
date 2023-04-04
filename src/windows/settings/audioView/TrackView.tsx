import React from "react";
import { MdPlayCircle } from "react-icons/md";

import { Button } from "@/components";

interface Props {
  name: string;
  onSelected: (name: string) => void;
  onTrackPreview: (name: string) => void;
}

const TrackView: React.FC<Props> = (props) => {
  return (
    <div
      className="card p-0 pl-2 text-text/70 hover:text-text/80"
      onClick={(e) =>
        // @ts-ignore
        !e.target.closest("button") && props.onSelected(props.name)
      }
      data-tauri-disable-drag
    >
      <div className="flex flex-row items-center justify-between">
        {props.name}
        <Button
          onClick={() => props.onTrackPreview(props.name)}
          transparent
          highlight={false}
        >
          <MdPlayCircle size={24} />
        </Button>
      </div>
    </div>
  );
};

export default TrackView;
