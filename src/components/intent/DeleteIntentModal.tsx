import React from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useClickOutside } from "@mantine/hooks";

import { Intent } from "@/bindings/Intent";
import { Button, DangerButton } from "@/ui";
import ipc from "@/ipc";
import { toast } from "react-hot-toast";

export interface DeleteIntentModalProps {
  data: Intent;
  onExit: () => void;
}

export const DeleteIntentModal: React.FC<DeleteIntentModalProps> = (props) => {
  const ref = useClickOutside(() => props.onExit());

  // fetch notes and tasks by intent id
  // near "tasks" and "notes" <span> display their length

  const deleteIntent = () => {
    ipc.deleteIntent(props.data.id).then(() => {
      toast("Intent deleted");
      props.onExit();
    });
  };

  return createPortal(
    <motion.div
      className="fixed left-0 top-0 w-screen h-screen flex flex-col items-center justify-center bg-darker/50 p-4"
      transition={{ duration: 0.15 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      data-tauri-disable-drag
    >
      <motion.div
        ref={ref}
        className="flex flex-col gap-4 p-2 bg-window rounded-sm border-2 border-base/60 shadow-xl shadow-black/80 text-center"
        transition={{ duration: 0.15 }}
        initial={{ scale: 0.8, translateY: 16 }}
        animate={{ scale: 1, translateY: 0 }}
      >
        <div className="font-semibold">
          <span>Are you sure you want to delete </span>
          <span className="text-primary">{props.data.label}</span>?
        </div>
        <div className="text-text/90 text-sm italic">
          This operation will also delete it's related
          <span className="text-primary/80"> tasks</span>
        </div>
        <div className="flex flex-row justify-between">
          <Button variant="base" onClick={() => props.onExit()}>
            Cancel
          </Button>
          <DangerButton variant="base" onClick={() => deleteIntent()}>
            Confirm
          </DangerButton>
        </div>
      </motion.div>
    </motion.div>,
    document.getElementById("root")!
  );
};
