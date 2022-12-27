import React from "react";

import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { MdAddCircle, MdSearch } from "react-icons/md";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import Button from "@/components/Button";
import IntentsList from "./IntentsList";
import { Sort } from ".";
import { Intent } from "@/bindings/Intent";
import { IntentForCreate } from "@/bindings/IntentForCreate";
import services from "@/app/services";

interface Props {
  intents: Intent[];
  selectedId?: string;
  setSelectedId: (id: string | undefined) => void;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const Sidebar: React.FC<Props> = (props) => {
  const [sort, setSort] = React.useState<Sort>("asc");

  const [viewCreate, setViewCreate] = React.useState(false);
  const [viewSearch, setViewSearch] = React.useState(false);

  return (
    <div className="w-60 h-full flex flex-col p-2 pr-0 gap-2">
      {/* Performs operations related to intents array */}
      {!viewCreate && !viewSearch ? (
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

          {/* Toggle search input */}
          <Button
            transparent
            onClick={() => setViewSearch((visible) => !visible)}
          >
            <MdSearch size={28} />
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
        </div>
      ) : null}
      {viewCreate ? (
        <CreateIntentView hide={() => setViewCreate(false)} />
      ) : null}
      {viewSearch ? <SearchBar /> : null}
      {props.intents.length > 0 ? (
        <IntentsList
          data={props.intents}
          selectedTags={props.selectedTags}
          selectedIntentId={props.selectedId}
          sort={sort}
          onSelected={(data) => props.setSelectedId(data)}
          onTagSelected={(data) => props.setSelectedTags(data)}
        />
      ) : (
        <div className="m-auto text-sm text-center text-text/80">
          <p>You have 0 targets.</p>
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

  const onSubmit = handleSubmit(async (data) => {
    await services.createIntent(data);
    toast("Intent created");
    props.hide();
  });

  return (
    <div className="flex flex-col p-2 bg-darker/20 shadow-inner rounded animate-in fade-in zoom-in-90">
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 focus-within:text-primary/60">
          <input
            autoFocus
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

// Search for filtering intents list in sidebar via their label
const SearchBar: React.FC = () => {
  return <div className="h-8 bg-darker/20 rounded">Search</div>;
};

export default Sidebar;
