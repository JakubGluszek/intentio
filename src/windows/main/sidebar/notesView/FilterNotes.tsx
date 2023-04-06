import React from "react";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion";

import { Button } from "@/components";
import motions from "@/motions";

interface FilterNotesViewProps {
  query: string;
  setQuery: (q: string) => void;
  hide: () => void;
}

const FilterNotes: React.FC<FilterNotesViewProps> = (props) => {
  return (
    <div className="w-full flex flex-row gap-0.5">
      <motion.input
        className="w-[220px] bg-window/90 border-base/80"
        autoFocus
        placeholder="Filter notes by content"
        autoComplete="off"
        tabIndex={-2}
        value={props.query}
        onChange={(e) => props.setQuery(e.currentTarget.value)}
        {...motions.scaleIn}
      />
      <motion.div className="window" {...motions.scaleIn}>
        <Button
          onClick={() => {
            props.setQuery("");
            props.hide();
          }}
          transparent
        >
          <MdClose size={24} />
        </Button>
      </motion.div>
    </div>
  );
};

export default FilterNotes;
