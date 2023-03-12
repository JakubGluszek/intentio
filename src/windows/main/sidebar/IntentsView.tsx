import React from "react";
import { MdAddCircle, MdAnalytics } from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import useStore from "@/store";
import ipc from "@/ipc";
import { Intent } from "@/bindings/Intent";
import { Button, IntentsList } from "@/components";
import { WebviewWindow } from "@tauri-apps/api/window";
import config from "@/config";

const IntentsView: React.FC = () => {
  const [selectedIntentTags, setSelectedIntentTags] = React.useState<string[]>(
    []
  );

  const store = useStore();

  const onIntentChange = async (data: Intent | undefined) => {
    store.setCurrentIntent(data);
  };

  React.useEffect(() => {
    ipc.getIntents().then((data) => store.setIntents(data));
  }, []);

  return (
    <div className="grow flex flex-col gap-0.5">
      <div className="w-full flex flex-row gap-0.5">
        <CreateIntentView />
        <div className="bg-window/90 border-2 border-base/80 rounded">
          <Button
            transparent
            onClick={() =>
              new WebviewWindow("intents", config.webviews.intents)
            }
          >
            <MdAnalytics size={24} />
          </Button>
        </div>
      </div>
      <div className="grow flex flex-col p-1.5 bg-window/90 border-2 border-base/80 rounded">
        <IntentsList
          data={store.intents.filter(
            (intent) =>
              intent.archived_at === null || intent.archived_at === undefined
          )}
          selectedIntentId={store.currentIntent?.id}
          selectedTags={selectedIntentTags}
          onSelected={onIntentChange}
          onTagSelected={(data) => setSelectedIntentTags(data)}
        />
      </div>
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
    <div className="w-full">
      {!viewCreate ? (
        <div className="w-full bg-window/90 border-2 border-base/80 rounded">
          <Button
            transparent
            style={{ width: "100%" }}
            onClick={() => setViewCreate(true)}
          >
            <MdAddCircle size={20} />
            <span>Add Intent</span>
          </Button>
        </div>
      ) : (
        <form
          ref={ref}
          onSubmit={onSubmit}
          className="w-full animate-in fade-in-0 zoom-in-90"
        >
          <input
            tabIndex={-3}
            {...register("label")}
            className="input bg-darker/80"
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
