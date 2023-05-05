import { Button, Card } from "@/ui";
import React from "react";
import { MdAudiotrack, MdPlayCircle } from "react-icons/md";

interface Props {
  name: string;
  onSelected: (name: string) => void;
  onTrackPreview: (name: string) => void;
}

const TrackView: React.FC<Props> = (props) => {
  return (
    <Card
      className="p-0.5 px-1"
      onClick={(e) =>
        // @ts-ignore
        !e.target.closest("button") && props.onSelected(props.name)
      }
      data-tauri-disable-drag
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-1 text-text/90 group-hover:text-text">
          <MdAudiotrack size={20} />
          <div>{props.name}</div>
        </div>
        <Button
          variant="ghost"
          className="opacity-0 group-hover:opacity-100"
          onClick={() => props.onTrackPreview(props.name)}
          config={{ ghost: { highlight: false } }}
        >
          <MdPlayCircle size={24} />
        </Button>
      </div>
    </Card>
  );
};

export default TrackView;
