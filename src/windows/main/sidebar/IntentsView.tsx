import React from "react";
import { MdAddCircle } from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import useStore from "@/store";
import ipc from "@/ipc";
import { Intent } from "@/bindings/Intent";
import { Button, IntentsList } from "@/components";

const IntentsView: React.FC = () => {
  const [selectedIntentTags, setSelectedIntentTags] = React.useState<string[]>(
    []
  );

  const store = useStore();

  const onIntentChange = async (data: Intent | undefined) => {
    await ipc.setActiveIntentId(data?.id).then(() => {
      store.setActiveIntentId(data?.id);
    });
  };

  return (
    <div className="grow flex flex-col pt-2 gap-0.5 animate-in fade-in-0 zoom-in-95">
      <CreateIntentView />
      <IntentsList
        data={store.intents.filter(
          (intent) =>
            intent.archived_at === null || intent.archived_at === undefined
        )}
        selectedIntentId={store.activeIntentId}
        selectedTags={selectedIntentTags}
        onSelected={onIntentChange}
        onTagSelected={(data) => setSelectedIntentTags(data)}
      />
    </div>
  );
};

const CreateIntentView: React.FC = () => {
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

  return (
    <div className="h-8 w-full flex flex-row items-center">
      {!viewCreate ? (
        <Button transparent onClick={() => setViewCreate(true)}>
          <MdAddCircle size={20} />
          <span>Add Intent</span>
        </Button>
      ) : (
        <form
          ref={ref}
          onSubmit={onSubmit}
          className="w-full animate-in fade-in-0 zoom-in-90"
        >
          <input
            tabIndex={-3}
            {...register("label")}
            className="input h-8"
            onKeyDown={(e) => {
              if (e.key !== "Escape") return;
              setViewCreate(false);
              setValue("label", "");
            }}
            placeholder="Label your intent"
            autoFocus
            autoComplete="off"
            minLength={1}
            maxLength={24}
          />
        </form>
      )}
    </div>
  );
};

export default IntentsView;
