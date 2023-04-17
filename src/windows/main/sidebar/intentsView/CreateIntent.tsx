import React from "react";
import { MdAddCircle } from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import { Button, Input } from "@/ui";
import ipc from "@/ipc";
import motions from "@/motions";

const CreateIntent: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);
  const { register, handleSubmit, setValue } = useForm<{ label: string }>();

  const ref = useClickOutside(() => {
    setValue("label", "");
    setViewCreate(false);
  });

  const onSubmit = handleSubmit((data) => {
    ipc
      .createIntent(data)
      .then(() => {
        toast("Intent created");
        setValue("label", "");
        setViewCreate(false);
      })
      .catch((err) => console.log("ipc.createTask", err));
  });

  if (!viewCreate)
    return (
      <Button onClick={() => setViewCreate(true)} variant="base">
        <MdAddCircle size={20} />
        <span>Add Intent</span>
      </Button>
    );

  return (
    <motion.form
      ref={ref}
      onSubmit={onSubmit}
      className="w-full"
      {...motions.scaleIn}
    >
      <Input
        onKeyDown={(e) => {
          if (e.key !== "Escape") return;
          setViewCreate(false);
          setValue("label", "");
        }}
        placeholder="Define your intent"
        autoFocus
        minLength={1}
        maxLength={20}
        {...register("label", {
          required: true,
          minLength: 1,
          maxLength: 20,
        })}
      />
    </motion.form>
  );
};

export default CreateIntent;
