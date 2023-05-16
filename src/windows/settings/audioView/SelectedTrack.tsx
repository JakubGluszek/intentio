import React from "react";
import {
  MdAdd,
  MdPlayCircle,
  MdRemove,
  MdVolumeDown,
  MdVolumeOff,
  MdVolumeUp,
} from "react-icons/md";
import { motion } from "framer-motion";

import { Button, Card, Slider, Tooltip } from "@/ui";

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
    <Card
      key={props.name}
      transition={{
        duration: 0.3,
        ease: "easeIn",
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <motion.div
        className="flex flex-col gap-1"
        transition={{ duration: 0.2, delay: 0.2 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Selected audio file with volume and repeat control */}
        <div className="flex flex-row items-center justify-between">
          <div className="w-[220px] text-text/80 uppercase font-bold whitespace-nowrap overflow-ellipsis overflow-hidden">
            {props.name}
          </div>
          <Tooltip label="Play audio">
            <Button
              onClick={() => props.onTrackPreview(props.name)}
              variant="ghost"
              config={{ ghost: { highlight: false } }}
            >
              <MdPlayCircle size={24} />
            </Button>
          </Tooltip>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row gap-2">
            <div className="w-full flex flex-row gap-1 items-center">
              <Button
                onClick={() => props.onVolumeChange(props.volume > 0 ? 0 : 0.5)}
                variant="ghost"
                config={{ ghost: { highlight: false } }}
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
            <Tooltip label="Iterations">
              <div className="flex flex-row items-center border-2 bg-darker/10 border-primary/40 rounded">
                <Button
                  onClick={() =>
                    props.repeat > 1 && props.onRepeatChange(props.repeat - 1)
                  }
                  variant="ghost"
                  className="rounded-none"
                >
                  <MdRemove size={20} />
                </Button>
                <div className="text-center px-2 font-mono text-lg">
                  {props.repeat}
                </div>
                <Button
                  variant="ghost"
                  onClick={() => props.onRepeatChange(props.repeat + 1)}
                  className="rounded-none"
                >
                  <MdAdd size={20} />
                </Button>
              </div>
            </Tooltip>
          </div>
        </div>
      </motion.div>
    </Card>
  );
};

export default SelectedTrack;
