import React from "react";

import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { MdAddCircle } from "react-icons/md";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import Button from "@/components/Button";
import IntentsList from "./IntentsList";
import { Sort } from ".";
import { IntentForCreate } from "@/bindings/IntentForCreate";
import services from "@/app/services";
import { useStore } from "@/app/store";
import { BiArchive } from "react-icons/bi";

interface Props {
  selectedId?: string;
  setSelectedId: (id: string | undefined) => void;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const Sidebar: React.FC<Props> = (props) => {
  const [sort, setSort] = React.useState<Sort>("asc");

  const [viewCreate, setViewCreate] = React.useState(false);
  const [viewArchived, setViewArchived] = React.useState(false);

  const intents = useStore((state) => state.intents);

  return (
    <div className="w-60 min-w-[240px] h-full flex flex-col p-2 pr-0 gap-2">
      {/* Performs operations related to intents array */}
      {!viewCreate ? (
        <div className="h-7 flex flex-row items-center gap-2">
          {/* Toggle create intent view */}
          <Button
            primary={true}
            size="fill"
            onClick={() => setViewCreate((visible) => !visible)}
          >
            <MdAddCircle size={24} />
            <span>Create</span>
          </Button>

          {/* Sort by intent label */}
          <Button
            transparent
            onClick={() => setSort((sort) => (sort === "asc" ? "desc" : "asc"))}
          >
            {sort === "asc" ? (
              <AiOutlineSortAscending size={28} />
            ) : (
              <AiOutlineSortDescending size={28} />
            )}
          </Button>
          {/* Filter by archived_at property */}
          <Button
            style={{ opacity: viewArchived ? 1.0 : 0.5 }}
            transparent
            onClick={() => setViewArchived((view) => !view)}
          >
            <BiArchive size={28} />
          </Button>
        </div>
      ) : null}
      {viewCreate ? (
        <CreateIntentView hide={() => setViewCreate(false)} />
      ) : null}
      {intents.length > 0 ? (
        <IntentsList
          data={
            viewArchived
              ? intents
              : intents.filter((intent) => !intent.archived_at)
          }
          selectedTags={props.selectedTags}
          selectedIntentId={props.selectedId}
          sort={sort}
          onSelected={(data) => props.setSelectedId(data)}
          onTagSelected={(data) => props.setSelectedTags(data)}
        />
      ) : (
        <div className="m-auto text-sm text-center text-text/80">
          <p>There are no defined intents</p>
        </div>
      )}
    </div>
  );
};

interface CreateIntentViewProps {
  hide: () => void;
}

const CreateIntentView: React.FC<CreateIntentViewProps> = (props) => {
  const { handleSubmit, register } = useForm<IntentForCreate>();

  const onSubmit = handleSubmit((data) => {
    services
      .createIntent(data)
      .then(() => {
        toast("Intent created");
        props.hide();
      })
      .catch((err) => console.log("create_intent", err));
  });

  return (
    <div className="flex flex-col p-2 bg-darker/20 shadow-inner rounded">
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 focus-within:text-primary/60">
          <input
            autoFocus
            maxLength={24}
            placeholder="Intent label"
            {...register("label", {
              required: true,
              minLength: 1,
              maxLength: 24,
            })}
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <Button transparent type="button" onClick={() => props.hide()}>
            Cancel
          </Button>
          <Button primary type="submit">
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Sidebar;
