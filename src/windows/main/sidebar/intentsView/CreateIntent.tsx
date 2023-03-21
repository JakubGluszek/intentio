import React from "react";
import { MdAddCircle } from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Button } from "@/components";
import ipc from "@/ipc";

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
        setViewCreate(false);
        setValue("label", "");
      })
      .catch((err) => console.log("ipc.createTask", err));
  });

  if (!viewCreate)
    return (
      <div className="w-full window">
        <Button
          transparent
          style={{ width: "100%" }}
          onClick={() => setViewCreate(true)}
          transition={{ delay: 0.2, duration: 0.3 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
        >
          <MdAddCircle size={20} />
          <span>Add Intent</span>
        </Button>
      </div>
    );

  return (
    <form ref={ref} onSubmit={onSubmit} className="w-full window border-0">
      <input
        className="w-full h-full bg-window/90 border-none"
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
    </form>
  );
};

export default CreateIntent;
