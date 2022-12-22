import React from "react";

import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { MdAddCircle, MdSearch } from "react-icons/md";

import Button from "@/components/Button";
import IntentsList from "./IntentsList";
import { Intent, Sort } from ".";

interface Props {
  intents: Intent[];
  selected?: Intent;
  setSelected: React.Dispatch<React.SetStateAction<Intent | undefined>>;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const Sidebar: React.FC<Props> = (props) => {
  const [sort, setSort] = React.useState<Sort>("asc");

  const [viewCreate, setViewCreate] = React.useState(false);
  const [viewSearch, setViewSearch] = React.useState(false);

  return (
    <div className="w-60 h-full flex flex-col p-2 gap-2">
      {/* Performs operations related to intents array */}
      <div className="h-8 flex flex-row items-center gap-2">
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
      {viewCreate ? <CreateIntentView /> : null}
      {viewSearch ? <SearchBar /> : null}
      <IntentsList
        data={props.intents}
        selectedTags={props.selectedTags}
        selectedIntent={props.selected}
        sort={sort}
        onSelected={(data) => props.setSelected(data)}
        onTagSelected={(data) => props.setSelectedTags(data)}
      />
    </div>
  );
};

const CreateIntentView: React.FC = () => {
  return <div className="">Create</div>;
};

// Search for filtering intents list in sidebar via their label
const SearchBar: React.FC = () => {
  return <div className="h-8 bg-darker/20 rounded">Search</div>;
};

export default Sidebar;
