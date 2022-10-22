import React from "react";
import { AiFillFolder, AiFillFolderOpen } from "react-icons/ai";
import {
  MdAdd,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdNotifications,
  MdRemove,
  MdVolumeDown,
  MdVolumeOff,
  MdVolumeUp,
} from "react-icons/md";

import { invoke } from "@tauri-apps/api/tauri";
import { type } from "@tauri-apps/api/os";
import { audioDir } from "@tauri-apps/api/path";
import { readDir, BaseDirectory, FileEntry } from "@tauri-apps/api/fs";

import { Slider } from "../../components";
import { playAudio } from "../../utils";
import { Settings } from "../../bindings/Settings";
import { ipc_invoke } from "../../ipc";

const AUDIO_FORMATS = [".mp3", ".ogg"];

interface Props {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings | undefined>>;
}

const AlertSection: React.FC<Props> = ({ settings, setSettings }) => {
  const [currentTrack, setCurrentTrack] = React.useState<FileEntry>({
    path: settings.alert_path,
  });
  const [tracks, setTracks] = React.useState<FileEntry[]>([]);

  React.useEffect(() => {
    readTracks();
  }, []);

  const readTracks = () => {
    readDir("pomodoro", {
      dir: BaseDirectory.Audio,
      recursive: false,
    }).then((entries) => {
      console.log(entries);
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
      if (track.path === currentTrack.path) {
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
      if (track.path === currentTrack.path) {
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
      settings: {
        ...settings,
        alert_path: track.path,
      },
    }).then((res) => setSettings(res.data));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-center gap-2">
        <div className="flex flex-row items-center gap-2">
          <MdNotifications size={28} />
          <span className="text-lg">Alerts</span>
        </div>
      </div>
      <div className="group card flex flex-col gap-3">
        <div className="flex flex-row items-center gap-4">
          <span className="text-sm">Sound</span>
          <div className="grow flex flex-row items-center justify-between px-2 bg-base group-hover:bg-window rounded">
            <button className="btn btn-ghost" onMouseUp={() => previousTrack()}>
              <MdKeyboardArrowLeft size={24} />
            </button>
            <span className="text-xs">{currentTrack?.name ?? "-"}</span>
            <button className="btn btn-ghost" onMouseUp={() => nextTrack()}>
              <MdKeyboardArrowRight size={24} />
            </button>
          </div>
          <OpenFileExplorerButton />
        </div>
        <div className="flex flex-row items-center gap-4">
          <button
            className="btn btn-ghost p-0"
            onClick={() => currentTrack && playAudio(currentTrack.path)}
          >
            {settings.alert_volume > 0 ? (
              settings.alert_volume < 0.5 ? (
                <MdVolumeDown size={24} />
              ) : (
                <MdVolumeUp size={24} />
              )
            ) : (
              <MdVolumeOff size={24} />
            )}
          </button>
          <Slider
            min={0}
            max={100}
            defaultValue={parseInt((settings.alert_volume * 100).toFixed())}
            onChangeEnd={(volume) =>
              ipc_invoke<Settings>("update_settings", {
                alert_volume: volume / 100,
              }).then((res) => setSettings(res.data))
            }
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <span>Repeat</span>
          <div className="flex flex-row items-center px-2 gap-2 bg-base group-hover:bg-window rounded">
            <button
              className="btn btn-ghost"
              onMouseUp={() =>
                settings.alert_repeat > 1 &&
                ipc_invoke<Settings>("update_settings", {
                  alert_repeat: settings.alert_repeat - 1,
                }).then((res) => setSettings(res.data))
              }
            >
              <MdRemove size={24} />
            </button>
            <span>{settings.alert_repeat}</span>
            <button
              className="btn btn-ghost"
              onMouseUp={() =>
                ipc_invoke<Settings>("update_settings", {
                  alert_repeat: settings.alert_repeat + 1,
                }).then((res) => setSettings(res.data))
              }
            >
              <MdAdd size={24} />
            </button>
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
    <button
      className="btn btn-ghost"
      onMouseUp={async () => {
        const osType = await type();
        const path = (await audioDir()) + "pomodoro";

        invoke("open_folder", { osType, path });
      }}
      onMouseEnter={() => setFolderIcon("open")}
      onMouseLeave={() => setFolderIcon("closed")}
    >
      {folderIcon === "closed" ? (
        <AiFillFolder size={32} />
      ) : (
        <AiFillFolderOpen size={32} />
      )}
    </button>
  );
};

export default AlertSection;
