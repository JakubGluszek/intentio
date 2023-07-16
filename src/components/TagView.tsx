import React from "react";
import { clsx } from "@mantine/core";
import { MdAddCircle, MdRemoveCircle, MdTag } from "react-icons/md";

import { Tag } from "@/bindings/Tag";
import { ModelId } from "@/types";
import { IconView } from "@/ui";

interface TagViewProps {
  data: Tag;
  isRemovable?: boolean;
  onRemove?: (id: ModelId) => void;
  isAddable?: boolean;
  onAdd?: (id: ModelId) => void;
}

export const TagView: React.FC<TagViewProps> = (props) => {
  const [isHover, setIsHover] = React.useState(false);
  const isRemovable = isHover && props.isRemovable;
  const isAddable = isHover && props.isAddable;
  const isModifiable = isAddable || isRemovable;

  return (
    <div
      className="relative p-0.5 rounded bg-primary/20 hover:bg-primary/30 text-primary/80 hover:text-primary transition-all duration-300"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className={clsx(
          "flex flex-row transition-opacity duration-300",
          isModifiable ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <IconView icon={MdTag} scale={0.8} />
        <span className="uppercase text-xs font-bold">{props.data.label}</span>
      </div>
      {isRemovable && (
        <button
          onClick={() => props.onRemove?.(props.data.id)}
          className="absolute fade-in animate-in duration-300 top-0 left-0 w-full h-full flex flex-row items-center justify-center active:bg-primary/20"
        >
          <IconView icon={MdRemoveCircle} scale={0.9} />
        </button>
      )}
      {isAddable && (
        <button
          onClick={() => props.onAdd?.(props.data.id)}
          className="absolute fade-in animate-in duration-300 top-0 left-0 w-full h-full flex flex-row items-center justify-center active:bg-primary/20"
        >
          <IconView icon={MdAddCircle} scale={0.9} />
        </button>
      )}
    </div>
  );
};
