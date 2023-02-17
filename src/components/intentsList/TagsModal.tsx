import React from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-hot-toast";
import { useClickOutside } from "@mantine/hooks";

import useStore from "@/store";
import ipc from "@/ipc";
import { Intent } from "@/bindings/Intent";
import ModalContainer from "../ModalContainer";
import TagButton from "../TagButton";
import Button from "../Button";

interface Props {
  data: Intent;
  hide: () => void;
}

export const TagsModal: React.FC<Props> = (props) => {
  const [newTag, setNewTag] = React.useState("");

  const ref = useClickOutside(() => props.hide());

  var allTags = useStore((state) => state.getAllTags)();

  allTags = allTags.filter((tag) =>
    props.data.tags.includes(tag) ? undefined : tag
  );

  const addTag = (tag: string) =>
    ipc
      .updateIntent(props.data.id, {
        tags: [tag, ...props.data.tags],
      })
      .then(() => {
        toast("Tag added");
        setNewTag("");
      });

  return (
    <ModalContainer>
      <div
        ref={ref}
        className="m-auto w-full max-w-sm flex flex-col gap-2 bg-window p-1.5 rounded overflow-y-auto shadow-2xl"
      >
        <input
          className="border-base"
          value={newTag}
          onChange={(e) => setNewTag(e.currentTarget.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && newTag.length > 0 && addTag(newTag)
          }
          autoFocus
          placeholder="Add a tag"
        />

        {props.data.tags.length > 0 ? (
          <div className="flex flex-row flex-wrap gap-1">
            {props.data.tags.map((tag) => (
              <TagButton disabled={true}>
                <div className="flex flex-row items-center gap-1">
                  <div>{tag}</div>
                  <Button
                    onClick={() =>
                      ipc
                        .updateIntent(props.data.id, {
                          tags: props.data.tags.filter((t) => t !== tag),
                        })
                        .then(() => toast("Tag removed"))
                    }
                    transparent
                    color="danger"
                  >
                    <MdClose size={16} />
                  </Button>
                </div>
              </TagButton>
            ))}
          </div>
        ) : null}

        {allTags.length > 0 ? (
          <div className="flex flex-col gap-1">
            <div className="text-text/60">Select from existing tags</div>
            <div className="flex flex-row flex-wrap gap-1">
              {allTags.map((tag) => (
                <TagButton onClick={() => addTag(tag)}>{tag}</TagButton>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </ModalContainer>
  );
};
