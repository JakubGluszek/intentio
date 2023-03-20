import React from "react";
import { BiArchiveIn, BiArchiveOut } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";

import useStore from "@/store";
import utils from "@/utils";
import ipc from "@/ipc";
import { ModalContainer, Button } from "@/components";
import { useConfirmDelete } from "@/hooks";
import { Intent } from "@/bindings/Intent";

interface Props {
  data: Intent;
  display: boolean;
  exit: () => void;
}

const DetailsModal: React.FC<Props> = (props) => {
  const { data } = props;

  const ref = useClickOutside(() => props.exit());
  const sessions = useStore((state) => state.getSessionsByIntentId)(data.id);

  const totalSessionsDuration = sessions.reduce((p, c) => (p += c.duration), 0);

  const { viewConfirmDelete, onDelete } = useConfirmDelete(() =>
    ipc.deleteIntent(data.id)
  );

  return (
    <ModalContainer display={props.display} hide={props.exit}>
      <div ref={ref} className="w-80 flex flex-col gap-2">
        {/* Intent timestamps and stats */}
        <div className="flex flex-col gap-2 bg-base rounded p-3 text-sm shadow-lg">
          <p className="flex flex-row items-center justify-between">
            <span className="text-text/80">Created at:</span>
            <span>{new Date(parseInt(data.created_at)).toLocaleString()}</span>
          </p>
          {data.archived_at ? (
            <p className="flex flex-row items-center justify-between">
              <span className="text-text/80">Archived at:</span>
              <span>
                {new Date(parseInt(data.archived_at)).toLocaleString()}
              </span>
            </p>
          ) : null}
          <p className="flex flex-row items-center justify-between">
            <span className="text-text/80">Total sessions:</span>
            <span>{sessions.length}</span>
          </p>
          <p className="flex flex-row items-center justify-between">
            <span className="text-text/80">Total focus duration:</span>
            <span>{utils.formatTime(totalSessionsDuration)}</span>
          </p>
          <p className="flex flex-row items-center justify-between">
            <span className="text-text/80">Average session duration:</span>
            <span>
              {sessions.length > 0
                ? (totalSessionsDuration / sessions.length).toFixed(1)
                : 0}
              min
            </span>
          </p>
        </div>
        {/* Intent Operations */}
        <div className="flex flex-row items-center justify-between h-7 gap-2 text-sm">
          {data.archived_at ? (
            <Button
              style={{ width: "fit-content" }}
              onClick={() => ipc.unarchiveIntent(data.id)}
            >
              <BiArchiveOut size={20} />
              <span>Unarchive</span>
            </Button>
          ) : (
            <Button
              style={{ width: "fit-content" }}
              onClick={() => ipc.archiveIntent(data.id)}
            >
              <BiArchiveIn size={20} />
              <span>Archive</span>
            </Button>
          )}
          <Button
            transparent={!viewConfirmDelete}
            color="danger"
            style={{ width: "fit-content" }}
            onClick={() => onDelete()}
          >
            <MdDelete size={viewConfirmDelete ? 24 : 28} />
            {viewConfirmDelete && "Confirm"}
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default DetailsModal;
