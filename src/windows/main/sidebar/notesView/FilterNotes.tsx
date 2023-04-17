import React from "react";
import { MdClose } from "react-icons/md";

import { Button, Input } from "@/ui";

interface FilterNotesViewProps {
  query: string;
  setQuery: (q: string) => void;
  hide: () => void;
}

const FilterNotes: React.FC<FilterNotesViewProps> = (props) => {
  return (
    <div className="w-full flex flex-row gap-0.5">
      <Input
        autoFocus
        placeholder="Filter notes by content"
        value={props.query}
        onChange={(e) => props.setQuery(e.currentTarget.value)}
      />

      <Button
        variant="ghost"
        onClick={() => {
          props.setQuery("");
          props.hide();
        }}
      >
        <MdClose size={24} />
      </Button>
    </div>
  );
};

export default FilterNotes;
