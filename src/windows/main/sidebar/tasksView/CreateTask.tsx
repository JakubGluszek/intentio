import React from "react";
import { MdAddCircle } from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import useStore from "@/store";
import ipc from "@/ipc";
import { Button } from "@/components";

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
      <div className="w-full window">
        <Button
          onClick={() => props.setViewCreate(true)}
          style={{ width: "100%" }}
          transparent
        >
          <MdAddCircle size={20} />
          <div>Add task</div>
        </Button>
      </div>
    );

  return (
    <form ref={ref} onSubmit={onSubmit} className="w-full">
      <input
        tabIndex={-3}
        {...register("body")}
        className="input bg-window/90"
        onKeyDown={(e) => {
          if (e.key !== "Escape") return;
          props.setViewCreate(false);
          setValue("body", "");
        }}
        placeholder="Describe your task"
        autoFocus
        minLength={1}
        autoComplete="off"
        maxLength={96}
      />
    </form>
  );
};

export default CreateTask;
