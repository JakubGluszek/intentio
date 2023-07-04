import React from "react";
import { ScrollArea } from "@mantine/core";
import { MdEdit } from "react-icons/md";

import { ModelId } from "@/types";
import { Button, IconView, Input, Modal } from "@/ui";
import ipc from "@/ipc";
import { TagView } from "@/components";
import { useIntent, useTags } from "@/hooks";
import { UpdateIntent } from "@/bindings/UpdateIntent";
import { toast } from "react-hot-toast";

interface IntentConfigModalProps {
  intentId: ModelId | null;
  onExit: () => void;
}

export const IntentConfigModal: React.FC<IntentConfigModalProps> = (props) => {
  const [label, setLabel] = React.useState("");
  const [viewEditTags, setViewEditTags] = React.useState(false);

  const intent = useIntent(props.intentId);

  const updateIntent = async (data: Partial<UpdateIntent>) => {
    if (!props.intentId) return;
    ipc.updateIntent(props.intentId, data);
  };

  React.useEffect(() => {
    if (!intent.data) return;
    setLabel(intent.data.label!);
  }, [intent.data]);

  // Clean up
  React.useEffect(() => {
    if (!props.intentId) {
      setLabel("");
      return;
    }
  }, [props.intentId]);

  if (!intent.data && props.intentId) return null;

  return (
    <>
      <Modal
        display={!!props.intentId}
        hidden={viewEditTags}
        header="Configure Intent"
        onExit={!viewEditTags ? props.onExit : undefined}
      >
        {/* Label */}
        <div className="flex flex-col p-1 bg-base/5">
          <Input
            value={label}
            onChange={(e) => setLabel(e.currentTarget.value)}
            onBlur={() => updateIntent({ label })}
            placeholder="Label"
            maxLength={24}
          />
        </div>
        {/* Tags */}
        <div className="flex flex-col gap-1 p-1 bg-base/5">
          <div className="flex flex-row items-center justify-between">
            <span className="text-text/80">Tags</span>
            <div className="flex flex-row items-center gap-1">
              <Button onClick={() => setViewEditTags(true)} variant="ghost">
                <IconView icon={MdEdit} />
              </Button>
            </div>
          </div>
          <ScrollArea scrollbarSize={0}>
            <div className="flex flex-row flex-wrap gap-1 p-1 bg-window rounded">
              {intent.tags.map((tag) => (
                <TagView key={tag.id} data={tag} />
              ))}
              {/* Empty Space Filler */}
              {intent.tags.length === 0 && (
                <div className="w-full text-text/50 text-center">0 tags</div>
              )}
            </div>
          </ScrollArea>
        </div>
      </Modal>

      <Modal
        display={viewEditTags}
        header="Edit Tags"
        onExit={() => setViewEditTags(false)}
      >
        <EditIntentTags intentId={props.intentId!} />
      </Modal>
    </>
  );
};

interface EditIntentTagsProps {
  intentId: ModelId;
}

const EditIntentTags: React.FC<EditIntentTagsProps> = (props) => {
  const intent = useIntent(props.intentId);
  const tags = useTags();

  const remainingTags = tags.data.filter(
    (tag) => !intent.tags.find((t) => t.id === tag.id)
  );

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex flex-col gap-1 p-1 bg-base/5 border border-base/5">
        <div className="text-text/80 text-sm">Selected Tags</div>
        <ScrollArea scrollbarSize={0}>
          <div className="flex flex-row flex-wrap gap-1 p-1 bg-window rounded">
            {intent.tags.map((tag) => (
              <TagView
                key={tag.id}
                data={tag}
                isRemovable
                onRemove={(tagId) =>
                  intent
                    .removeTag({ intent_id: props.intentId, tag_id: tagId })
                    .then(() => toast("Tag removed"))
                }
              />
            ))}
            {/* Empty Space Filler */}
            {intent.tags.length === 0 && (
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
                onAdd={(tagId) =>
                  intent
                    .addTag({ intent_id: props.intentId, tag_id: tagId })
                    .then(() => toast("Tag added"))
                }
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
