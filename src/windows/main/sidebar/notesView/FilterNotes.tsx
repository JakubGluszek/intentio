import React from "react";
import { MdClose } from "react-icons/md";

import { Button } from "@/components";

interface FilterNotesViewProps {
  query: string;
  setQuery: (q: string) => void;
  toggleDisplay: () => void;
}

const FilterNotes: React.FC<FilterNotesViewProps> = (props) => {
  return (
    <div className="w-full animate-in fade-in-0 zoom-in-90">
      <div className="relative">
        <input
          tabIndex={-2}
          className="input bg-window/90"
          autoFocus
          placeholder='Press "ESCAPE" to exit'
          autoComplete="off"
          value={props.query}
          onChange={(e) => props.setQuery(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key !== "Escape") return;
            props.setQuery("");
            props.toggleDisplay();
          }}
        />
        {props.query.length > 1 ? (
          <Button
            onClick={() => {
              props.setQuery("");
              props.toggleDisplay();
            }}
            style={{
              position: "absolute",
              right: 4,
              top: 6,
            }}
            transparent
          >
            <MdClose size={24} />
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default FilterNotes;
