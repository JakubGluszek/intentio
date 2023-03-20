import React from "react";
import { MdClose } from "react-icons/md";

import { Button } from "@/components";

interface FilterNotesViewProps {
  query: string;
  setQuery: (q: string) => void;
  hide: () => void;
}

const FilterNotes: React.FC<FilterNotesViewProps> = (props) => {
  return (
    <div className="w-full flex flex-row gap-0.5">
      <input
        className="w-[220px] bg-window/90 border-base/80"
        autoFocus
        placeholder="Filter notes by content"
        autoComplete="off"
        tabIndex={-2}
        value={props.query}
        onChange={(e) => props.setQuery(e.currentTarget.value)}
      />
      <div className="window">
        <Button
          onClick={() => {
            props.setQuery("");
            props.hide();
          }}
          transparent
        >
          <MdClose size={24} />
        </Button>
      </div>
    </div>
  );
};

export default FilterNotes;
