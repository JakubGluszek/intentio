import React from "react";
import {
  MdAdd,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdPauseCircle,
  MdPlayCircle,
  MdRemove,
  MdVolumeDown,
  MdVolumeOff,
  MdVolumeUp,
} from "react-icons/md";
import { AiFillFolder, AiFillFolderOpen } from "react-icons/ai";
import { BaseDirectory, FileEntry, readDir } from "@tauri-apps/api/fs";

import ipc from "@/ipc";
import { Slider, Button } from "@/components";
import useStore from "@/store";
import { AudioConfigForUpdate } from "@/bindings/AudioConfigForUpdate";

const AUDIO_FORMATS = [".mp3", ".ogg"];

const AudioView: React.FC = () => {
  const [tracks, setTracks] = React.useState<FileEntry[]>([]);

  const store = useStore();
  const config = store.audioConfig;

  const updateConfig = async (data: Partial<AudioConfigForUpdate>) => {
    const result = await ipc.updateAudioConfig(data);
    store.setAudioConfig(result);
    return result;
  };

  React.useEffect(() => {
    readTracks();
    ipc.getAudioConfig().then((data) => store.setAudioConfig(data));
  }, []);

  // Reads files in audio directory matchings the specified file formats
  const readTracks = () => {
    readDir("audio", {
      dir: BaseDirectory.Resource,
      recursive: true,
    }).then((entries) => {
      setTracks(
        entries.filter((entry) =>
          AUDIO_FORMATS.some((ending) => entry.path.endsWith(ending))
        )
      );
    });
  };

  if (!config) return null;

  return (
    <div className="relative grow flex flex-col gap-0.5">
      <SelectedAudio
        name={config.alert_file}
        volume={config.alert_volume}
        repeat={config.alert_repeat}
        onVolumeChange={(volume) => updateConfig({ alert_volume: volume })}
        onRepeatChange={(repeats) => updateConfig({ alert_repeat: repeats })}
      />
      <div className="grow flex flex-col overflow-y-auto window bg-window">
        <div className="z-10 sticky top-0 flex flex-row gap-1 items-center p-1 bg-window">
          <OpenFileExplorerButton />
        </div>
        <div className="max-h-0 overflow-y">
          <TracksList
            tracks={tracks.filter((track) => track.name !== config.alert_file)}
            onTrackSelected={(track) =>
              updateConfig({ alert_audio: track.name })
            }
          />
        </div>
      </div>
    </div>
  );
};

interface TracksListProps {
  tracks: FileEntry[];
  onTrackSelected: (track: FileEntry) => void;
}

const TracksList: React.FC<TracksListProps> = (props) => {
  return (
    <div className="flex flex-col p-2 gap-1">
      {props.tracks.map((track, idx) => (
        <TrackView
          key={idx}
          name={track.name!}
          onSelected={() => props.onTrackSelected(track)}
        />
      ))}
    </div>
  );
};

interface TrackViewProps {
  name: string;
  onSelected: (name: string) => void;
}

const TrackView: React.FC<TrackViewProps> = (props) => {
  const [playingAudio, setPlayingAudio] = React.useState(false);

  const playAudio = () => {
    !playingAudio &&
      ipc
        .playAudio(props.name)
        .then(() => setPlayingAudio(false))
        .catch(() => setPlayingAudio(false));
    !playingAudio && setPlayingAudio(true);
  };

  return (
    <div
      className="card p-1"
      onClick={(e) =>
        // @ts-ignore
        !e.target.closest("button") && props.onSelected(props.name)
      }
      data-tauri-disable-drag
    >
      <div className="flex flex-row items-center justify-between">
        {props.name}
        <Button onClick={() => playAudio()} disabled={playingAudio} transparent highlight={false}>
          <MdPlayCircle size={24} />
        </Button>
      </div>
    </div>
  );
};

interface SelectedAudioProps {
  name: string;
  volume: number;
  repeat: number;
  onVolumeChange: (volume: number) => void;
  onRepeatChange: (repeats: number) => void;
}

const SelectedAudio: React.FC<SelectedAudioProps> = (props) => {
  return (
    <div className="flex flex-col window bg-window border-primary/20 p-2 gap-1">
      {/* Selected audio file with volume and repeat control */}
      <div className="font-mono text-primary/80 uppercase font-black">
        {props.name}
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row gap-2">
          <div className="w-full flex flex-row gap-1 items-center">
            <Button
              style={{ padding: 0 }}
              highlight={false}
              transparent
              onClick={() => props.onVolumeChange(props.volume > 0 ? 0 : 0.5)}
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
          <div className="flex flex-row items-center border-2 bg-darker/10 border-primary/20 rounded-sm">
            <Button
              style={{ height: "100%" }}
              rounded={false}
              transparent
              onClick={() => props.onRepeatChange(props.repeat - 1)}
            >
              <MdRemove size={24} />
            </Button>
            <div className="text-center px-4 font-mono text-lg">
              {props.repeat}
            </div>
            <Button
              style={{ height: "100%" }}
              rounded={false}
              transparent
              onClick={() => props.onRepeatChange(props.repeat + 1)}
            >
              <MdAdd size={24} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OpenFileExplorerButton: React.FC = () => {
  const [folderIcon, setFolderIcon] = React.useState<"open" | "closed">(
    "closed"
  );

  return (
    <Button
      transparent
      highlight={false}
      onClick={() => ipc.openAudioDir()}
      onMouseEnter={() => setFolderIcon("open")}
      onMouseLeave={() => setFolderIcon("closed")}
    >
      {folderIcon === "closed" ? (
        <AiFillFolder size={24} />
      ) : (
        <AiFillFolderOpen size={24} />
      )}
      <label>Open folder</label>
    </Button>
  );
};

export default AudioView;
