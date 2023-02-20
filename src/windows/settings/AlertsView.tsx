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
import { Checkbox } from "@mantine/core";
import { BaseDirectory, FileEntry, readDir } from "@tauri-apps/api/fs";

import ipc from "@/ipc";
import { Slider, Button } from "@/components";
import { Settings } from "@/bindings/Settings";
import { SettingsForUpdate } from "@/bindings/SettingsForUpdate";

const AUDIO_FORMATS = [".mp3", ".ogg"];

interface Props {
  settings: Settings;
  update: (data: Partial<SettingsForUpdate>) => Promise<Settings>;
}

const AlertsView: React.FC<Props> = (props) => {
  const [currentTrack, setCurrentTrack] = React.useState<FileEntry>({
    name: props.settings.alert_audio,
    path: "",
  });
  const [tracks, setTracks] = React.useState<FileEntry[]>([]);

  const [volumeKey, setVolumeKey] = React.useState<undefined | null>(undefined);
  const [playingAudio, setPlayingAudio] = React.useState(false);

  React.useEffect(() => {
    readTracks();
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

  const nextTrack = () => {
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (track.name === currentTrack.name) {
        let nextTrack: FileEntry;
        if (i < tracks.length - 1) {
          nextTrack = tracks[i + 1];
          setCurrentTrack(nextTrack);
        } else {
          nextTrack = tracks[0];
          setCurrentTrack(nextTrack);
        }
        updateTrack(nextTrack);
      }
    }
  };

  const previousTrack = () => {
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (track.name === currentTrack.name) {
        let nextTrack: FileEntry;
        if (i > 0) {
          nextTrack = tracks[i - 1];
          setCurrentTrack(nextTrack);
        } else {
          nextTrack = tracks[tracks.length - 1];
          setCurrentTrack(nextTrack);
        }
        updateTrack(nextTrack);
      }
    }
  };

  const updateTrack = (track: FileEntry) => {
    props.update({ alert_audio: track.name });
  };

  const playAudio = () => {
    currentTrack &&
      !playingAudio &&
      ipc
        .playAudio(currentTrack.path)
        .then(() => setPlayingAudio(false))
        .catch(() => setPlayingAudio(false));
    !playingAudio && setPlayingAudio(true);
  };

  return (
    <div className="flex flex-col gap-3 pb-2">
      <div className="flex flex-row items-center card">
        <label className="w-full" htmlFor="system-notifications">System notifications</label>
        <Checkbox
          tabIndex={-2}
          size="sm"
          id="system-notifications"
          defaultChecked={props.settings.system_notifications}
          onChange={(value) =>
            props.update({
              system_notifications: value.currentTarget.checked,
            })
          }
          styles={{
            icon: { color: "rgb(var(--primary-color)) !important" },
            root: { height: "20px" },
          }}
          classNames={{
            input:
              "border-primary checked:border-primary bg-transparent checked:bg-transparent border-2",
          }}
        />
      </div>
      <div className="flex flex-col gap-3 card">
        <div className="flex flex-row items-center gap-4">
          <span>Audio</span>
          <div className="w-10 grow flex flex-row items-center justify-between px-2 py-0.5 bg-base rounded shadow">
            <Button transparent onClick={() => previousTrack()}>
              <MdKeyboardArrowLeft size={24} />
            </Button>
            <span className="text-sm text-center w-full whitespace-nowrap overflow-ellipsis overflow-hidden">
              {currentTrack?.name ?? "-"}
            </span>
            <Button transparent onClick={() => nextTrack()}>
              <MdKeyboardArrowRight size={24} />
            </Button>
          </div>
          <OpenFileExplorerButton />
        </div>
        <div className="flex flex-row items-center gap-4">
          <Button
            transparent
            disabled={playingAudio}
            onClick={() => {
              props
                .update({
                  alert_volume: props.settings.alert_volume === 0 ? 0.5 : 0,
                })
                .then(() => {
                  setVolumeKey((key) => (key === undefined ? null : undefined));
                });
            }}
          >
            {props.settings.alert_volume > 0 ? (
              props.settings.alert_volume < 0.5 ? (
                <MdVolumeDown size={28} />
              ) : (
                <MdVolumeUp size={28} />
              )
            ) : (
              <MdVolumeOff size={28} />
            )}
          </Button>
          <Slider
            key={volumeKey}
            disabled={playingAudio}
            min={0}
            max={100}
            defaultValue={parseInt(
              (props.settings.alert_volume * 100).toFixed()
            )}
            onChangeEnd={(volume) =>
              props
                .update({
                  alert_volume: volume / 100,
                })
                .then(() => {
                  setVolumeKey(undefined);
                })
            }
          />
          <Button transparent onClick={() => playAudio()}>
            {playingAudio ? (
              <MdPauseCircle size={28} />
            ) : (
              <MdPlayCircle size={28} />
            )}
          </Button>
        </div>
        {/* Repeat alert iterations */}
        <div className="flex flex-row items-center gap-4">
          <span>Repeat</span>
          <div className="flex flex-row items-center px-2 py-0.5 gap-2 bg-base rounded shadow">
            <Button
              transparent
              onClick={() =>
                props.settings.alert_repeat > 1 &&
                props.update({
                  alert_repeat: props.settings.alert_repeat - 1,
                })
              }
            >
              <MdRemove size={24} />
            </Button>
            <div className="w-8 text-center">{props.settings.alert_repeat}</div>
            <Button
              transparent
              onClick={() =>
                props.update({
                  alert_repeat: props.settings.alert_repeat + 1,
                })
              }
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
      onClick={() => ipc.openAudioDir()}
      onMouseEnter={() => setFolderIcon("open")}
      onMouseLeave={() => setFolderIcon("closed")}
    >
      {folderIcon === "closed" ? (
        <AiFillFolder size={28} />
      ) : (
        <AiFillFolderOpen size={28} />
      )}
    </Button>
  );
};

export default AlertsView;
