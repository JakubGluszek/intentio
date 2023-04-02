import React from "react";
import { MdAddCircle } from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import { Button } from "@/components";
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
      <motion.div className="w-full window rounded-none" {...motions.scaleIn}>
        <Button
          onClick={() => setViewCreate(true)}
          style={{ width: "100%" }}
          transparent
          rounded={false}
        >
          <MdAddCircle size={20} />
          <span>Add Intent</span>
        </Button>
      </motion.div>
    );

  return (
    <motion.form
      ref={ref}
      onSubmit={onSubmit}
      className="w-full"
      {...motions.scaleIn}
    >
      <input
        className="bg-window/90 rounded-none"
        onKeyDown={(e) => {
          if (e.key !== "Escape") return;
          setViewCreate(false);
          setValue("label", "");
        }}
        placeholder="Define your intent"
        tabIndex={-3}
        autoFocus
        autoComplete="off"
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
