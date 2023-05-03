import React from "react";
import {
  MdAdd,
  MdPlayCircle,
  MdRemove,
  MdVolumeDown,
  MdVolumeOff,
  MdVolumeUp,
} from "react-icons/md";

import { Button, Pane, Slider } from "@/ui";

interface Props {
  name: string;
  volume: number;
  repeat: number;
  onVolumeChange: (volume: number) => void;
  onRepeatChange: (repeats: number) => void;
  onTrackPreview: (name: string) => void;
}

const SelectedTrack: React.FC<Props> = (props) => {
  return (
    <Pane className="flex flex-col gap-2">
      {/* Selected audio file with volume and repeat control */}
      <div className="flex flex-row items-center justify-between">
        <div className="text-text/80 uppercase font-bold">{props.name}</div>
        <Button
          onClick={() => props.onTrackPreview(props.name)}
          variant="ghost"
          config={{ ghost: { highlight: false } }}
        >
          <MdPlayCircle size={24} />
        </Button>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row gap-2">
          <div className="w-full flex flex-row gap-1 items-center">
            <Button
              onClick={() => props.onVolumeChange(props.volume > 0 ? 0 : 0.5)}
              variant="ghost"
            >
              {props.volume > 0 ? (
                props.volume < 0.5 ? (
                  <MdVolumeDown size={28} />
                ) : (
                  <MdVolumeUp size={28} />
                )
              ) : (
                <MdVolumeOff size={28} />
              )}
            </Button>
            <Slider
              key={props.volume}
              min={0}
              max={100}
              defaultValue={parseInt((props.volume * 100).toFixed())}
              onChangeEnd={(volume) => props.onVolumeChange(volume / 100)}
            />
          </div>
          <div className="flex flex-row items-center border-2 bg-darker/10 border-primary/40 rounded-sm">
            <Button
              onClick={() => props.onRepeatChange(props.repeat - 1)}
              variant="ghost"
            >
              <MdRemove size={20} />
            </Button>
            <div className="text-center px-4 font-mono text-lg">
              {props.repeat}
            </div>
            <Button
              variant="ghost"
              onClick={() => props.onRepeatChange(props.repeat + 1)}
            >
              <MdAdd size={20} />
            </Button>
          </div>
        </div>
      </div>
    </Pane>
  );
};

export default SelectedTrack;
