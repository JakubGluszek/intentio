import React from "react";
import { AiFillFolder, AiFillFolderOpen } from "react-icons/ai";
import {
  MdAdd,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdNotifications,
  MdPauseCircle,
  MdPlayCircle,
  MdRemove,
  MdVolumeDown,
  MdVolumeOff,
  MdVolumeUp,
} from "react-icons/md";
import { Checkbox } from "@mantine/core";
import { readDir, BaseDirectory, FileEntry } from "@tauri-apps/api/fs";
import services from "@/app/services";

import { Slider } from "../../components";
import { Settings } from "../../bindings/Settings";
import Button from "../../components/Button";
import { SettingsForUpdate } from "@/bindings/SettingsForUpdate";

const AUDIO_FORMATS = [".mp3", ".ogg"];

interface Props {
  settings: Settings;
  update: (data: Partial<SettingsForUpdate>) => Promise<Settings>;
}

const AlertSection: React.FC<Props> = (props) => {
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
    readDir("assets/audio", {
      dir: BaseDirectory.Resource,
      recursive: false,
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
      services
        .playAudio(currentTrack.path)
        .then(() => setPlayingAudio(false))
        .catch(() => setPlayingAudio(false));
    !playingAudio && setPlayingAudio(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-center gap-2">
        <div className="flex flex-row items-center gap-2">
          <MdNotifications size={32} />
          <span className="text-xl">Alerts</span>
        </div>
      </div>
      <div className="group card flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between pr-1">
          <label htmlFor="system-notifications">System notifications</label>
          <Checkbox
            size="md"
            id="system-notifications"
            defaultChecked={props.settings.system_notifications}
            onChange={(value) =>
              props.update({
                system_notifications: value.currentTarget.checked,
              })
            }
            styles={{ icon: { color: "var(--primary-color) !important" } }}
            classNames={{
              input:
                "border-primary checked:border-primary bg-transparent checked:bg-transparent border-2",
            }}
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <span className="text-sm">Sound</span>
          <div className="grow flex flex-row items-center justify-between px-2 bg-base group-hover:bg-window rounded">
            <Button transparent onClick={() => previousTrack()}>
              <MdKeyboardArrowLeft size={24} />
            </Button>
            <span className="text-xs">{currentTrack?.name ?? "-"}</span>
            <Button transparent onClick={() => nextTrack()}>
              <MdKeyboardArrowRight size={24} />
            </Button>
          </div>
          <OpenFileExplorerButton />
        </div>
        <div className="flex flex-row items-center gap-4">
          <Button
            transparent
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
                <MdVolumeDown size={32} />
              ) : (
                <MdVolumeUp size={32} />
              )
            ) : (
              <MdVolumeOff size={32} />
            )}
          </Button>
          <Slider
            key={volumeKey}
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
              <MdPauseCircle size={32} />
            ) : (
              <MdPlayCircle size={32} />
            )}
          </Button>
        </div>
        <div className="flex flex-row items-center gap-4">
          <span>Repeat</span>
          <div className="flex flex-row items-center px-2 gap-2 bg-base group-hover:bg-window rounded">
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
            <span>{props.settings.alert_repeat}</span>
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
      onClick={() => services.openAudioDir()}
      onMouseEnter={() => setFolderIcon("open")}
      onMouseLeave={() => setFolderIcon("closed")}
    >
      {folderIcon === "closed" ? (
        <AiFillFolder size={32} />
      ) : (
        <AiFillFolderOpen size={32} />
      )}
    </Button>
  );
};

export default AlertSection;
