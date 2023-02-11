import React from "react";
import {
  BaseDirectory,
  FileEntry,
  readDir,
  readTextFile,
} from "@tauri-apps/api/fs";
import { Command } from "@tauri-apps/api/shell";
import { clsx } from "@mantine/core";
import { toast } from "react-hot-toast";

import { Button } from "@/components";

const SCRIPT_FORMATS = [".sh"];

const readScripts = async () => {
  const scripts = await readDir("intentio/scripts", {
    dir: BaseDirectory.Config,
    recursive: true,
  });

  return scripts.filter((entry) =>
    SCRIPT_FORMATS.some((ending) => entry.path.endsWith(ending))
  );
};

const ScriptsView: React.FC = () => {
  const [scripts, setScripts] = React.useState<FileEntry[]>([]);

  React.useEffect(() => {
    readScripts().then((scripts) => setScripts(scripts));
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1.5">
        {scripts.map((script, i) => (
          <ScriptView key={i} data={script} />
        ))}
      </div>
    </div>
  );
};

interface ScriptView {
  data: FileEntry;
}

const ScriptView: React.FC<ScriptView> = (props) => {
  const [isExecuting, setIsExecuting] = React.useState(false);

  const execute = async () => {
    setIsExecuting(true);
    const content = await readContent();

    const output = await new Command("sh", ["-c", content]).execute();

    return output;
  };

  // reads & returns script content
  const readContent = async () => {
    return await readTextFile(props.data.path, {
      dir: BaseDirectory.Config,
    });
  };

  return (
    <div
      className={clsx(
        "flex flex-row justify-between gap-1 bg-window p-1.5 rounded",
        isExecuting && "border-b-4 border-primary/60"
      )}
    >
      <div>{props.data.name}</div>
      <div className="flex flex-row items-center">
        <Button
          transparent
          onClick={async () =>
            !isExecuting &&
            execute()
              .then((e) => {
                toast(`Exit code: ${e.code}`);
                setIsExecuting(false);
              })
              .catch(() => setIsExecuting(false))
          }
        >
          Test
        </Button>
      </div>
    </div>
  );
};

export default ScriptsView;
