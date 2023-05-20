import React from "react";
import { MdAddCircle } from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import useStore from "@/store";
import ipc from "@/ipc";
import { Button, Input } from "@/ui";

interface CreateTaskViewProps {
  viewCreate: boolean;
  setViewCreate: (view: boolean) => void;
}

const CreateTask: React.FC<CreateTaskViewProps> = (props) => {
  const store = useStore();
  const { register, handleSubmit, setValue } = useForm<{ body: string }>();
  const ref = useClickOutside(() => props.setViewCreate(false));

  const onSubmit = handleSubmit((data) => {
    if (!store.currentIntent) return;
    ipc
      .createTask({ ...data, intent_id: store.currentIntent?.id })
      .then(() => {
        toast("Task created");
        setValue("body", "");
        props.setViewCreate(false);
      })
      .catch((err) => console.log("ipc.createTask", err));
  });

  if (!props.viewCreate)
    return (
      <Button variant="base" onClick={() => props.setViewCreate(true)}>
        <MdAddCircle size={20} />
        <div>Add task</div>
      </Button>
    );

  return (
    <form ref={ref} onSubmit={onSubmit} className="w-full">
      <Input
        {...register("body")}
        onKeyDown={(e) => {
          if (e.key !== "Escape") return;
          props.setViewCreate(false);
          setValue("body", "");
        }}
        placeholder="Describe your task"
        autoFocus
        minLength={1}
        maxLength={96}
      />
    </form>
  );
};

export default CreateTask;
