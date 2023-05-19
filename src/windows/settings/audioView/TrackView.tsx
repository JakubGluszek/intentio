import React from "react";
import { MdAudiotrack, MdPlayCircle } from "react-icons/md";

import { Button, Card, Tooltip } from "@/ui";

interface Props {
  name: string;
  onSelected: () => void;
  onTrackPreview: () => void;
}

const TrackView: React.FC<Props> = (props) => {
  return (
    <Card
      className="p-1 px-1 cursor-pointer"
      onClick={(e) =>
        // @ts-ignore
        !e.target.closest("button") && props.onSelected()
      }
      transition={{ duration: 0.2, ease: "linear" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      clickable
      data-tauri-disable-drag
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-1 text-text/90 group-hover:text-text font-semibold">
          <MdAudiotrack size={20} />
          <div className="w-[200px] whitespace-nowrap overflow-ellipsis overflow-hidden">
            {props.name}
          </div>
        </div>
        <Tooltip label="Play audio">
          <Button
            variant="ghost"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => props.onTrackPreview()}
            config={{ ghost: { highlight: false } }}
          >
            <MdPlayCircle size={24} />
          </Button>
        </Tooltip>
      </div>
    </Card>
  );
};

export default TrackView;
