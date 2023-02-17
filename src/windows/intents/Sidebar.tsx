import React from "react";

import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { BiArchive } from "react-icons/bi";
import { MdAddCircle } from "react-icons/md";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Tooltip } from "@mantine/core";

import useStore from "@/store";
import ipc from "@/ipc";
import Button from "@/components/Button";
import { IntentForCreate } from "@/bindings/IntentForCreate";
import { IntentsSort } from "@/types";
import IntentsList from "@/components/intentsList";

interface Props {
  selectedId?: string;
  setSelectedId: (id: string | undefined) => void;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const Sidebar: React.FC<Props> = (props) => {
  const [sort, setSort] = React.useState<IntentsSort>("asc");

  const [viewCreate, setViewCreate] = React.useState(false);
  const [viewArchived, setViewArchived] = React.useState(false);

  const intents = useStore((state) => state.intents);

  return (
    <div className="min-w-[220px] w-[220px] h-full flex flex-col p-2 pr-0">
      {/* Performs operations related to intents array */}
      {!viewCreate ? (
        <div className="h-7 flex flex-row items-center gap-2">
          {/* Toggle create intent view */}
          <Button
            color="primary"
            style={{ width: "100%" }}
            onClick={() => setViewCreate((visible) => !visible)}
          >
            <MdAddCircle size={22} />
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
          <Tooltip
            withArrow
            label={viewArchived ? "Hide Archived" : "View Archived"}
          >
            <div>
              <Button
                opacity={viewArchived ? 1.0 : 0.5}
                transparent
                onClick={() => setViewArchived((view) => !view)}
              >
                <BiArchive size={28} />
              </Button>
            </div>
          </Tooltip>
        </div>
      ) : null}
      {viewCreate ? (
        <CreateIntentView hide={() => setViewCreate(false)} />
      ) : null}
      <IntentsList
        data={
          viewArchived
            ? intents
            : intents.filter((intent) => !intent.archived_at)
        }
        selectedTags={props.selectedTags}
        selectedIntentId={props.selectedId}
        sort={sort}
        onSelected={(data) => props.setSelectedId(data?.id)}
        onTagSelected={(data) => props.setSelectedTags(data)}
      />
    </div>
  );
};

interface CreateIntentViewProps {
  hide: () => void;
}

const CreateIntentView: React.FC<CreateIntentViewProps> = (props) => {
  const { handleSubmit, register } = useForm<IntentForCreate>();

  const onSubmit = handleSubmit((data) => {
    ipc
      .createIntent(data)
      .then(() => {
        toast("Intent created");
        props.hide();
      })
      .catch((err) => console.log("create_intent", err));
  });

  return (
    <div className="flex flex-col p-2 bg-darker/20 shadow-inner rounded">
      <form onSubmit={onSubmit} className="flex flex-col gap-2 text-sm">
        <div className="flex flex-col gap-1 focus-within:text-primary/60">
          <input
            autoComplete="off"
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
        <div className="h-7 flex flex-row items-center justify-between">
          <Button transparent type="button" onClick={() => props.hide()}>
            Cancel
          </Button>
          <Button
            color="primary"
            style={{ width: "fit-content" }}
            type="submit"
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Sidebar;
