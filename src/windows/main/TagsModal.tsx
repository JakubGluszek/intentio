import React from "react";
import { MdAddCircle, MdRemoveCircle, MdTag } from "react-icons/md";
import { clsx, ScrollArea } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { toast } from "react-hot-toast";

import { Button, IconView, Input, Modal } from "@/ui";
import { ModelId } from "@/types";
import { useTags } from "@/hooks";
import { Tag } from "@/bindings/Tag";
import { CreateTag } from "@/bindings/CreateTag";

interface TagsModalProps {
  display: boolean;
  onExit: () => void;
}

export const TagsModal: React.FC<TagsModalProps> = (props) => {
  const [viewCreate, setViewCreate] = React.useState(false);
  const [viewRemove, setViewRemove] = React.useState(false);

  const tags = useTags();

  React.useEffect(() => {
    if (tags.data.length === 0) setViewRemove(false);
  }, [tags.data]);

  return (
    <Modal
      {...props}
      header="Intent Tags"
      description="Add your own custom tags which you can then apply for different intents based on how you decide to categorize them. Utilizing this will greatly improve the way you can analyze a group of related intents."
    >
      <div className="flex flex-col gap-1 p-1 bg-base/5 rounded-sm">
        {/* Navbar */}
        <div className="flex flex-row items-center justify-between">
          <span className="text-text/80">
            {viewRemove ? "Remove tags" : "All Tags"}
          </span>
          {/* Button Bar */}
          <div className="flex flex-row gap-1">
            <Button onClick={() => setViewCreate(true)} variant="ghost">
              <IconView icon={MdAddCircle} />
            </Button>
            {tags.data.length > 0 && (
              <Button
                onClick={() => setViewRemove((prev) => !prev)}
                variant="ghost"
                className={viewRemove ? "text-primary" : undefined}
              >
                <IconView icon={MdRemoveCircle} />
              </Button>
            )}
          </div>
        </div>
        {/* Tags List */}
        <ScrollArea scrollbarSize={0}>
          <div className="flex flex-row flex-wrap gap-1 p-1 bg-window rounded">
            {viewCreate && (
              <CreateTagView
                onCreate={tags.create}
                onExit={() => setViewCreate(false)}
              />
            )}
            {tags.data.map((tag) => (
              <TagView
                key={tag.id}
                data={tag}
                onRemove={tags.remove}
                isRemovable={viewRemove}
              />
            ))}

            {/* Empty Space Filler */}
            {tags.data.length === 0 && !viewCreate && (
              <div className="w-full text-text/50 text-center">0 tags</div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Modal>
  );
};

interface CreateTagViewProps {
  onCreate: (data: CreateTag) => Promise<number>;
  onExit: () => void;
}

const CreateTagView: React.FC<CreateTagViewProps> = (props) => {
  const [value, setValue] = React.useState("");

  const ref = useClickOutside(props.onExit);

  return (
    <div
      ref={ref}
      className="flex flex-row items-center gap-1 p-1 rounded bg-primary/20 hover:bg-primary/30 text-primary/80 hover:text-primary transition-all duration-300"
    >
      <IconView icon={MdTag} />
      <Input
        className="h-6 border-none"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyUp={(e) => {
          let label = e.currentTarget.value;
          if (label.length < 1) return;
          if (e.key === "Enter") {
            // Get rid of white spaces
            label = label.split(" ").join("");
            props.onCreate({ label }).then(() => {
              toast("Tag created");
              props.onExit();
            });
          }
        }}
        minLength={1}
        maxLength={32}
        autoFocus
      />
    </div>
  );
};

interface TagViewProps {
  data: Tag;
  isRemovable: boolean;
  onRemove: (id: ModelId) => Promise<ModelId>;
}

const TagView: React.FC<TagViewProps> = (props) => {
  const [isHover, setIsHover] = React.useState(false);
  const isRemovable = isHover && props.isRemovable;

  return (
    <div
      className="relative p-0.5 rounded bg-primary/20 hover:bg-primary/30 text-primary/80 hover:text-primary transition-all duration-300"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className={clsx(
          "flex flex-row transition-opacity duration-300",
          isRemovable ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <IconView icon={MdTag} scale={0.8} />
        <span className="uppercase text-xs font-bold">{props.data.label}</span>
      </div>
      {isRemovable && (
        <button
          onClick={() =>
            props.onRemove(props.data.id).then(() => toast("Tag deleted"))
          }
          className="absolute fade-in animate-in duration-300 top-0 left-0 w-full h-full flex flex-row items-center justify-center active:bg-primary/20"
        >
          <IconView icon={MdRemoveCircle} scale={0.9} />
        </button>
      )}
    </div>
  );
};