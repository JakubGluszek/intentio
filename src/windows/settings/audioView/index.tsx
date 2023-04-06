import React from "react";
import { AiFillFolder, AiFillFolderOpen } from "react-icons/ai";
import { BaseDirectory, FileEntry, readDir } from "@tauri-apps/api/fs";

import ipc from "@/ipc";
import { Button } from "@/components";
import useStore from "@/store";
import { AudioConfigForUpdate } from "@/bindings/AudioConfigForUpdate";
import SelectedTrack from "./SelectedTrack";
import TrackView from "./TrackView";

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
      <SelectedTrack
        name={config.alert_file}
        volume={config.alert_volume}
        repeat={config.alert_repeat}
        onVolumeChange={(volume) => updateConfig({ alert_volume: volume })}
        onRepeatChange={(repeats) => updateConfig({ alert_repeat: repeats })}
        onTrackPreview={() => ipc.playAudio(config.alert_file)}
      />
      <div className="grow flex flex-col overflow-y-auto window bg-window">
        <div className="flex flex-row gap-1 items-center p-1 bg-window">
          <OpenFileExplorerButton />
        </div>
        <div className="max-h-0 overflow-y">
          <div className="flex flex-col p-2 gap-1">
            {tracks.map((track, idx) => (
              <TrackView
                key={idx}
                name={track.name!}
                onSelected={() => updateConfig({ alert_audio: track.name })}
                onTrackPreview={() => ipc.playAudio(track.name)}
              />
            ))}
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
