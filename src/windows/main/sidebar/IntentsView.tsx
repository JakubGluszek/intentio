import React from "react";

import useStore from "@/store";
import ipc from "@/ipc";
import { Intent } from "@/bindings/Intent";
import IntentsList from "@/windows/intents/IntentsList";
import { Button } from "@/components";
import { MdAddCircle } from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

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
    <div className="grow flex flex-col pt-2">
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
    <div className="h-fit w-full">
      {!viewCreate ? (
        <Button transparent onClick={() => setViewCreate(true)}>
          <MdAddCircle size={20} />
          <span>Add Intent</span>
        </Button>
      ) : (
        <form ref={ref} onSubmit={onSubmit}>
          <input
            tabIndex={-3}
            {...register("label")}
            className="input h-8"
            onKeyDown={(e) => {
              if (e.key !== "Escape") return;
              setViewCreate(false);
              setValue("label", "");
            }}
            autoFocus
            minLength={1}
            maxLength={24}
          />
        </form>
      )}
    </div>
  );
};

export default IntentsView;
