import React from "react";
import { BaseDirectory, FileEntry, readDir } from "@tauri-apps/api/fs";

import ipc from "@/ipc";
import useStore from "@/store";
import { Pane } from "@/ui";
import SelectedTrack from "./SelectedTrack";
import TrackView from "./TrackView";
import { OpenFileExplorerButton } from "./OpenFileExplorerButton";

const AUDIO_FORMATS = [".mp3", ".ogg"];

const AudioView: React.FC = () => {
  const [tracks, setTracks] = React.useState<FileEntry[]>([]);

  const store = useStore();
  const settings = store.settingsConfig;

  React.useEffect(() => {
    readTracks();
  }, []);

  // Reads files in audio directory matching the specified file formats
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

  if (!settings) return null;

  return (
    <div className="relative grow flex flex-col gap-0.5">
      <SelectedTrack
        name={settings.alert_file}
        volume={settings.alert_volume}
        repeat={settings.alert_repeat}
        onVolumeChange={(volume) =>
          ipc.updateSettingsConfig({ alert_volume: volume })
        }
        onRepeatChange={(repeats) =>
          ipc.updateSettingsConfig({ alert_repeat: repeats })
        }
        onTrackPreview={() => ipc.playAudio(settings.alert_file)}
      />
      <Pane className="grow flex flex-col gap-2 overflow-y-auto" padding="lg">
        <OpenFileExplorerButton />
        <div className="max-h-0 overflow-y">
          <div className="flex flex-col pb-1.5 gap-1">
            {tracks
              .filter((track) => track.name !== settings.alert_file)
              .map((track, idx) => (
                <TrackView
                  key={idx}
                  name={track.name!}
                  onSelected={() =>
                    ipc.updateSettingsConfig({ alert_audio: track.name })
                  }
                  onTrackPreview={() => ipc.playAudio(track.name)}
                />
              ))}
          </div>
        </div>
      </Pane>
    </div>
  );
};

export default AudioView;
