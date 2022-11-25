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
import { type } from "@tauri-apps/api/os";
import { readDir, BaseDirectory, FileEntry } from "@tauri-apps/api/fs";

import { Slider } from "../../components";
import { Settings } from "../../bindings/Settings";
import { ipc_invoke } from "../../app/ipc";
import Button from "../../components/Button";

const AUDIO_FORMATS = [".mp3", ".ogg"];

interface Props {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings | undefined>>;
}

const AlertSection: React.FC<Props> = ({ settings, setSettings }) => {
  const [currentTrack, setCurrentTrack] = React.useState<FileEntry>({
    name: settings.alert_audio,
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
      let track = tracks[i];
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
      let track = tracks[i];
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
    ipc_invoke<Settings>("update_settings", {
      data: {
        ...settings,
        alert_audio: track.name,
      },
    }).then((res) => setSettings(res.data));
  };

  const playAudio = () => {
    currentTrack &&
      !playingAudio &&
      ipc_invoke("play_audio", { data: currentTrack.path })
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
            defaultChecked={settings.system_notifications}
            onChange={(value) =>
              ipc_invoke("update_settings", {
                data: {
                  system_notifications: value.currentTarget.checked,
                },
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
              ipc_invoke<Settings>("update_settings", {
                data: {
                  alert_volume: settings.alert_volume === 0 ? 0.5 : 0,
                },
              }).then((res) => {
                setSettings(res.data);
                setVolumeKey((key) => (key === undefined ? null : undefined));
              });
            }}
          >
            {settings.alert_volume > 0 ? (
              settings.alert_volume < 0.5 ? (
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
            defaultValue={parseInt((settings.alert_volume * 100).toFixed())}
            onChangeEnd={(volume) =>
              ipc_invoke<Settings>("update_settings", {
                data: {
                  alert_volume: volume / 100,
                },
              }).then((res) => {
                setSettings(res.data);
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
                settings.alert_repeat > 1 &&
                ipc_invoke<Settings>("update_settings", {
                  data: {
                    alert_repeat: settings.alert_repeat - 1,
                  },
                }).then((res) => setSettings(res.data))
              }
            >
              <MdRemove size={24} />
            </Button>
            <span>{settings.alert_repeat}</span>
            <Button
              transparent
              onClick={() =>
                ipc_invoke<Settings>("update_settings", {
                  data: {
                    alert_repeat: settings.alert_repeat + 1,
                  },
                }).then((res) => setSettings(res.data))
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
      onClick={async () => {
        const osType = await type();

        // TODO: Handle os type on backend using appropriate macros
        ipc_invoke("open_audio_directory", { osType });
      }}
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
