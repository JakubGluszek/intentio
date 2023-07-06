import React from "react";
import { clsx } from "@mantine/core";
import { MdDelete, MdEdit } from "react-icons/md";
import { RiArchiveFill, RiArchiveLine } from "react-icons/ri";
import { toast } from "react-hot-toast";

import { ModelId } from "@/types";
import { Button, IconView, Input, Modal, ScrollArea } from "@/ui";
import ipc from "@/ipc";
import { TagView } from "@/components";
import { useIntent, useTags } from "@/hooks";
import { UpdateIntent } from "@/bindings/UpdateIntent";
import { Intent } from "@/bindings/Intent";

interface IntentConfigModalProps {
  intentId: ModelId | null;
  onExit: () => void;
}

export const IntentConfigModal: React.FC<IntentConfigModalProps> = (props) => {
  const [label, setLabel] = React.useState("");
  const [viewEditTags, setViewEditTags] = React.useState(false);
  const [viewDeleteModal, setViewDeleteModal] = React.useState(false);

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

  const viewMainModal = !viewEditTags && !viewDeleteModal;

  if (!intent.data && props.intentId) return null;

  return (
    <>
      <Modal
        display={!!props.intentId}
        hidden={!viewMainModal}
        header="Configure Intent"
        onExit={viewMainModal ? props.onExit : undefined}
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
          <ScrollArea>
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
        <div className="flex flex-row items-center justify-between p-1 bg-base/5">
          <span className="text-text/80">Manage</span>
          {/* Button Bar */}
          <div className="flex flex-row items-center gap-1">
            <Button
              variant="ghost"
              onClick={() =>
                intent.data?.archived_at
                  ? intent.unarchive().then(() => toast("Intent unarchived"))
                  : intent.archive().then(() => toast("Intent archived"))
              }
            >
              {intent.data?.archived_at ? (
                <IconView icon={RiArchiveFill} />
              ) : (
                <IconView icon={RiArchiveLine} />
              )}
            </Button>
            <Button onClick={() => setViewDeleteModal(true)} variant="ghost">
              <IconView icon={MdDelete} />
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        display={viewEditTags}
        header="Edit Tags"
        onExit={() => setViewEditTags(false)}
      >
        <EditIntentTags intentId={props.intentId!} />
      </Modal>
      <Modal
        display={viewDeleteModal}
        header="Delete Intent"
        onExit={() => setViewDeleteModal(false)}
      >
        <ScrollArea>
          <DeleteIntent
            intent={intent.data!}
            onDelete={(id) =>
              intent.remove(id).then(() => {
                toast("Intent deleted");
                setViewDeleteModal(false);
                props.onExit();
              })
            }
            onExit={() => setViewDeleteModal(false)}
          />
        </ScrollArea>
      </Modal>
    </>
  );
};

interface DeleteIntentProps {
  intent: Intent;
  onDelete: (id: number) => void;
  onExit: () => void;
}

const DeleteIntent: React.FC<DeleteIntentProps> = (props) => {
  const [label, setLabel] = React.useState("");

  const canDelete = label === props.intent.label;

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex flex-col bg-base/5 gap-1 p-1">
        <p className="text-text/80">
          Are you sure you want to delete&nbsp;
          <span className="text-primary font-bold uppercase">
            {props.intent.label}
          </span>
          ?
        </p>
        <p className="text-text/60 text-sm">
          You will loose x hours of progress and all of it’s related content.
          This operation is irreversible.
        </p>
      </div>
      <div className="flex flex-col gap-1 bg-base/5 p-1">
        <p className="text-text/80 text-sm">
          To confirm, type&nbsp;
          <span className="text-danger font-bold">{props.intent.label}</span>
          &nbsp;below.
        </p>
        <Input
          value={label}
          onChange={(e) => setLabel(e.currentTarget.value)}
          className={clsx(
            "transition-colors duration-300",
            canDelete && "border-danger/40 focus:border-danger/60"
          )}
        />
        <Button
          onClick={() => props.onDelete(props.intent.id)}
          variant="base"
          className={clsx(
            "w-full",
            !canDelete
              ? "bg-danger/10 border-danger/20 text-danger/80 hover:bg-danger/20 hover:text-danger active:text-danger/60 active:border-danger/20 hover:border-danger/30 active:bg-danger/10"
              : "bg-danger/20 border-danger/40 text-danger/80 hover:bg-danger/40 hover:text-danger active:text-window active:border-transparent hover:border-danger/60 active:bg-danger"
          )}
        >
          Delete
        </Button>
      </div>
    </div>
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
        <ScrollArea>
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
        <ScrollArea>
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
