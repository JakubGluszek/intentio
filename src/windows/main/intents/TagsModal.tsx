import React from "react";
import { MdAddCircle, MdRemoveCircle, MdTag } from "react-icons/md";
import { ScrollArea } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { toast } from "react-hot-toast";

import { Button, IconView, Input, Modal } from "@/ui";
import { useTags } from "@/hooks";
import { TagView } from "@/components";
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
    <Modal {...props} header={{ label: "Intent Tags", icon: MdTag }}>
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
      <div className="p-2 bg-base/10 rounded-lg shadow-lg shadow-black/50 border border-lighter/10">
        <ScrollArea sx={{ flex: 1 }}>
          <div className="flex flex-row flex-wrap gap-1">
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
        maxLength={20}
        autoFocus
      />
    </div>
  );
};
