import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import ipc from "@/ipc";
import { Button, Input, Modal } from "@/ui";

interface CreateTaskModalProps {
  display: boolean;
  intentId: number;
  onExit: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = (props) => {
  const { register, handleSubmit } = useForm<{ body: string }>();

  const onSubmit = handleSubmit((data) => {
    ipc.createTask({ ...data, intent_id: props.intentId }).then(() => {
      toast("Task created");
      props.onExit();
    });
  });

  const maxLength = 64;

  return (
    <Modal
      display={props.display}
      onExit={props.onExit}
      header={{ label: "Create task" }}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <Input
          maxLength={maxLength}
          {...register("body", { required: true, minLength: 1, maxLength })}
        />
        <Button variant="base" className="w-full" type="submit">
          Save
        </Button>
      </form>
    </Modal>
  );
};
