import React from "react";

import ipc from "@/ipc";
import { Button, Input } from "@/ui";
import { Intent } from "@/bindings/Intent";
import { toast } from "react-hot-toast";
import { MdClose } from "react-icons/md";

export interface EditIntentProps {
  data: Intent;
  onExit: () => void;
}

export const EditIntent: React.FC<EditIntentProps> = (props) => {
  const [label, setLabel] = React.useState(props.data.label);

  return (
    <div className="relative">
      <Input
        className="h-8"
        value={label}
        onChange={(e) => setLabel(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") props.onExit();
          if (e.key === "Enter") {
            if (label.length === 0) return;
            ipc.updateIntent(props.data.id, { label }).then(() => {
              toast("Intent updated");
              props.onExit();
            });
          }
        }}
        autoFocus
        minLength={1}
        maxLength={20}
      />

      <Button
        variant="ghost"
        className="absolute right-0.5 top-0.5 rounded-none"
        onClick={() => props.onExit()}
      >
        <MdClose size={20} />
      </Button>
    </div>
  );
};
