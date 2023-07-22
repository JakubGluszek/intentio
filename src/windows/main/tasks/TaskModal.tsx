import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { Input, Modal, DangerButton } from "@/ui";
import { Task } from "@/bindings/Task";
import ipc from "@/ipc";
import { useConfirmDelete } from "@/hooks";

interface TaskModalProps {
  data: Task;
  display: boolean;
  onExit: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = (props) => {
  const { register, handleSubmit, setValue } = useForm<{ body: string }>();

  const { viewConfirmDelete, onDelete } = useConfirmDelete(() =>
    ipc.deleteTask(props.data.id).then(() => {
      toast("Task deleted");
      props.onExit();
    })
  );

  const onSubmit = handleSubmit((data) => {
    ipc.updateTask(props.data.id, data).then(() => {
      toast("Task updated");
    });
  });

  const maxLength = 64;

  React.useEffect(() => {
    setValue("body", props.data.body);
  }, []);

  return (
    <Modal
      display={props.display}
      onExit={props.onExit}
      header={{ label: "Task details" }}
    >
      <div className="flex flex-col gap-2">
        <form onSubmit={onSubmit}>
          <Input
            maxLength={maxLength}
            placeholder="Label"
            {...register("body", { required: true, minLength: 1, maxLength })}
          />
        </form>
        <div className="flex flex-row items-center justify-end">
          <DangerButton variant="base" onClick={onDelete}>
            {viewConfirmDelete ? "Confirm" : "Delete"}
          </DangerButton>
        </div>
      </div>
    </Modal>
  );
};
