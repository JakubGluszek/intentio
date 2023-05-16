import React from "react";
import { BaseDirectory, FileEntry, readDir } from "@tauri-apps/api/fs";
import { appWindow } from "@tauri-apps/api/window";
import { toast } from "react-hot-toast";
import { MdRefresh } from "react-icons/md";

import ipc from "@/ipc";
import useStore from "@/store";
import { CascadeSections, OverflowY } from "@/components";
import { Button, Pane, Section, Tooltip } from "@/ui";
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

  /** Reads files in audio directory matching the specified file formats. */
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

  React.useEffect(() => {
    if (tracks.length === 0) return;

    if (!tracks.some((track) => track.name === settings?.alert_file)) {
      ipc.updateSettingsConfig({ alert_file: tracks[0].name }).then(() =>
        toast(
          <div>
            <p>Change detected.</p>
            <p>Settings updated.</p>
          </div>
        )
      );
    }
  }, [tracks]);

  // re-read tracks on regained window focus
  React.useEffect(() => {
    const unlisten = appWindow.onFocusChanged(
      ({ payload }) => payload && readTracks()
    );

    return () => unlisten.then((fn) => fn()) as never;
  }, []);

  if (!settings) return null;

  return (
    <Pane className="grow flex flex-col" padding="lg">
      <OverflowY>
        <CascadeSections>
          <Section heading="Selected track">
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
          </Section>
          <Section
            heading={
              <div className="flex flex-row items-center justify-between">
                <div className="section-heading">All tracks</div>
                <div className="flex flex-row gap-1">
                  <Tooltip label="Reload">
                    <Button variant="ghost" onClick={() => readTracks()}>
                      <MdRefresh size={24} />
                    </Button>
                  </Tooltip>
                  <OpenFileExplorerButton />
                </div>
              </div>
            }
          >
            <div className="flex flex-col pb-1.5 gap-1">
              {tracks
                .filter((track) => track.name !== settings.alert_file)
                .map((track) => (
                  <TrackView
                    key={track.name}
                    name={track.name!}
                    onSelected={() =>
                      ipc
                        .updateSettingsConfig({ alert_file: track.name })
                        .then(() => toast("Selected new track."))
                    }
                    onTrackPreview={() => ipc.playAudio(track.name)}
                  />
                ))}
            </div>
          </Section>
        </CascadeSections>
      </OverflowY>
    </Pane>
  );
};

export default AudioView;
