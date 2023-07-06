import React from "react";
import { MdAddCircle } from "react-icons/md";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { ScrollArea } from "@mantine/core";

import { Button, IconView, Input, Modal } from "@/ui";
import { useTags } from "@/hooks";
import { TagView } from "@/components";
import { Tag } from "@/bindings/Tag";
import { CreateIntent } from "@/bindings/CreateIntent";
import ipc from "@/ipc";

interface CreateIntentProps {
  display: boolean;
  onCreate: (data: CreateIntent) => Promise<number>;
  onExit: () => void;
}

export const CreateIntentModal: React.FC<CreateIntentProps> = (props) => {
  const [viewAddTags, setViewAddTags] = React.useState(false);
  const [tags, setTags] = React.useState<Tag[]>([]);

  const { register, handleSubmit, setValue } = useForm<CreateIntent>();

  const onSubmit = handleSubmit((data) => {
    props.onCreate(data).then((intentId) => {
      toast("Intent created");
      props.onExit();
      tags.map((tag, idx) =>
        ipc
          .addIntentTag({ intent_id: intentId, tag_id: tag.id })
          // Clear state on last request success
          .then(() => tags.length - 1 === idx && setTags([]))
      );
    });
  });

  React.useEffect(() => {
    if (props.display) return;
    setValue("label", "");
  }, [props.display]);

  return (
    <>
      <Modal
        display={props.display}
        header="Create Intent"
        hidden={viewAddTags}
        onExit={!viewAddTags ? props.onExit : undefined}
      >
        <form onSubmit={onSubmit} className="grow flex flex-col gap-0.5">
          <div className="flex flex-col bg-base/5 p-1">
            <Input
              placeholder="Label"
              autoFocus
              maxLength={24}
              {...register("label", {
                required: true,
                minLength: 1,
                maxLength: 24,
              })}
            />
          </div>
          <div className="flex flex-col gap-1 p-1 bg-base/5">
            <div className="flex flex-row items-center justify-between">
              <span className="text-text/60 font-semibold">Tags</span>
              <Button
                onClick={() => setViewAddTags(true)}
                variant="ghost"
                config={{ ghost: { highlight: false } }}
              >
                <IconView icon={MdAddCircle} />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-row flex-wrap gap-1 p-1 bg-window rounded">
                {tags.map((tag) => (
                  <TagView key={tag.id} data={tag} />
                ))}
              </div>
            )}
          </div>
          <div className="bg-base/5 p-1">
            <Button type="submit" variant="base" className="w-full">
              SAVE
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        display={viewAddTags}
        header="Add Tags"
        onExit={() => setViewAddTags(false)}
      >
        <AddIntentTagsProps tags={tags} setTags={setTags} />
      </Modal>
    </>
  );
};

interface AddIntentTagsProps {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
}

const AddIntentTagsProps: React.FC<AddIntentTagsProps> = (props) => {
  const tags = useTags();

  const remainingTags = tags.data.filter(
    (tag) => !props.tags.find((t) => t.id === tag.id)
  );

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex flex-col gap-1 p-1 bg-base/5 border border-base/5">
        <div className="text-text/80 text-sm">Selected Tags</div>
        <ScrollArea scrollbarSize={0}>
          <div className="flex flex-row flex-wrap gap-1 p-1 bg-window rounded">
            {props.tags.map((tag) => (
              <TagView
                key={tag.id}
                data={tag}
                isRemovable
                onRemove={(tagId) =>
                  props.setTags(props.tags.filter((tag) => tag.id !== tagId))
                }
              />
            ))}
            {/* Empty Space Filler */}
            {props.tags.length === 0 && (
              <div className="w-full text-text/50 text-center text-sm">
                0 tags
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="flex flex-col gap-1 p-1 bg-base/5 border border-base/5">
        <div className="text-text/80 text-sm">Remaining Tags</div>
        <ScrollArea scrollbarSize={0}>
          <div className="flex flex-row flex-wrap gap-1 p-1 bg-window rounded">
            {remainingTags.map((tag) => (
              <TagView
                key={tag.id}
                data={tag}
                isAddable
                onAdd={() => props.setTags([tag, ...props.tags])}
              />
            ))}
            {/* Empty Space Filler */}
            {remainingTags.length === 0 && (
              <div className="w-full text-text/50 text-center text-sm">
                No more tags to select
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
