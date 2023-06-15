import React from "react";
import { AiFillFolder, AiFillFolderOpen } from "react-icons/ai";

import ipc from "@/ipc";
import { Button, Tooltip } from "@/ui";

export const OpenFileExplorerButton: React.FC = () => {
  const [folderIcon, setFolderIcon] = React.useState<"open" | "closed">(
    "closed"
  );

  return (
    <Tooltip label="Open folder">
      <Button
        variant="ghost"
        onClick={() => ipc.openAudioDir()}
        onMouseEnter={() => setFolderIcon("open")}
        onMouseLeave={() => setFolderIcon("closed")}
      >
        {folderIcon === "closed" ? (
          <AiFillFolder size={24} />
        ) : (
          <AiFillFolderOpen size={24} />
        )}
      </Button>
    </Tooltip>
  );
};
