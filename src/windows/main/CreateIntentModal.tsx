import React from "react";
import { MdAddCircle } from "react-icons/md";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { Button, IconView, Input, Modal } from "@/ui";
import { CreateIntent } from "@/bindings/CreateIntent";

interface CreateIntentProps {
  display: boolean;
  onCreate: (data: CreateIntent) => Promise<number>;
  onExit: () => void;
}

export const CreateIntentModal: React.FC<CreateIntentProps> = (props) => {
  const { register, handleSubmit, setValue } = useForm<CreateIntent>();

  const onSubmit = handleSubmit((data) => {
    props.onCreate(data).then(() => {
      toast("Intent created");
      setValue("label", "");
      props.onExit();
    });
  });

  return (
    <Modal header="Create Intent" {...props}>
      <form onSubmit={onSubmit} className="grow flex flex-col gap-0.5">
        <div className="flex flex-col bg-base/5 p-1">
          <Input
            placeholder="Label"
            autoFocus
            maxLength={24}
            {...register("label", {
              required: true,
              minLength: 1,
              maxLength: 24,
            })}
          />
        </div>
        <div className="flex flex-row items-center justify-between bg-base/5 p-1">
          <span className="text-text/60 font-semibold">Tags</span>
          <Button
            variant="ghost"
            config={{ ghost: { highlight: false } }}
            disabled
          >
            <IconView icon={MdAddCircle} />
          </Button>
        </div>
        <div className="bg-base/5 p-1">
          <Button type="submit" variant="base" className="w-full">
            SAVE
          </Button>
        </div>
      </form>
    </Modal>
  );
};
