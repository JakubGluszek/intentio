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
  const [currentTrack, setCurrentTrack] = React.useState<FileEntry>();
  const [tracks, setTracks] = React.useState<FileEntry[]>([]);

  const [volumeKey, setVolumeKey] = React.useState<undefined | null>(undefined);
  const [playingAudio, setPlayingAudio] = React.useState(false);

  const store = useStore();

  const config = store.audioConfig;

  const updateConfig = async (data: Partial<AudioConfigForUpdate>) => {
    const result = await ipc.updateAudioConfig(data);
    store.setAudioConfig(result);
    return result;
  };

  React.useEffect(() => {
    config && setCurrentTrack({ name: config.alert_file, path: "" });
  }, [config]);

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

  const nextTrack = () => {
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (track.name === currentTrack?.name) {
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
      if (track.name === currentTrack?.name) {
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

  const updateTrack = async (track: FileEntry) => {
    return await updateConfig({ alert_audio: track.name });
  };

  const playAudio = () => {
    currentTrack &&
      !playingAudio &&
      ipc
        .playAudio(currentTrack?.path)
        .then(() => setPlayingAudio(false))
        .catch(() => setPlayingAudio(false));
    !playingAudio && setPlayingAudio(true);
  };

  if (!config) return null;

  return (
    <div className="flex flex-col gap-3 pb-2 animate-in fade-in-0 zoom-in-95">
      {/* <div className="flex flex-row items-center card"> */}
      {/*   <label className="w-full" htmlFor="system-notifications"> */}
      {/*     System notifications */}
      {/*   </label> */}
      {/*   <Checkbox */}
      {/*     tabIndex={-2} */}
      {/*     size="sm" */}
      {/*     id="system-notifications" */}
      {/*     defaultChecked={config.} */}
      {/*     onChange={(value) => */}
      {/*       props.update({ */}
      {/*         system_notifications: value.currentTarget.checked, */}
      {/*       }) */}
      {/*     } */}
      {/*     styles={{ */}
      {/*       icon: { color: "rgb(var(--primary-color)) !important" }, */}
      {/*       root: { height: "20px" }, */}
      {/*     }} */}
      {/*     classNames={{ */}
      {/*       input: */}
      {/*         "border-primary checked:border-primary bg-transparent checked:bg-transparent border-2", */}
      {/*     }} */}
      {/*   /> */}
      {/* </div> */}
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
            onClick={async () => {
              updateConfig({
                alert_volume: config.alert_volume === 0 ? 0.5 : 0,
              }).then(() => {
                setVolumeKey((key) => (key === undefined ? null : undefined));
              });
            }}
          >
            {config.alert_volume > 0 ? (
              config.alert_volume < 0.5 ? (
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
            defaultValue={parseInt((config.alert_volume * 100).toFixed())}
            onChangeEnd={async (volume) =>
              updateConfig({
                alert_volume: volume / 100,
              }).then(() => {
                setVolumeKey(undefined);
              })
            }
          />
          <Button
            disabled={playingAudio}
            transparent
            onClick={() => playAudio()}
          >
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
              onClick={async () =>
                config.alert_repeat > 1 &&
                updateConfig({
                  alert_repeat: config.alert_repeat - 1,
                })
              }
            >
              <MdRemove size={24} />
            </Button>
            <div className="w-8 text-center">{config.alert_repeat}</div>
            <Button
              transparent
              onClick={async () =>
                updateConfig({
                  alert_repeat: config.alert_repeat + 1,
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

export default AudioView;
