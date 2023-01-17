import React from "react";
import { BiArchiveIn, BiArchiveOut } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";

import app from "@/app";
import utils from "@/utils";
import services from "@/app/services";
import { ModalContainer, Button } from "@/components";
import { Intent } from "@/bindings/Intent";
import DeleteButton from "@/components/DeleteButton";

interface Props {
  data: Intent;
  exit: () => void;
}

const DetailsModal: React.FC<Props> = (props) => {
  const { data } = props;

  const [viewConfirmDelete, setViewConfirmDelete] = React.useState(false);

  const ref = useClickOutside(() => props.exit());
  const sessions = app.useStore((state) => state.getSessionsByIntentId)(
    data.id
  );

  const totalSessionsDuration = sessions.reduce((p, c) => (p += c.duration), 0);

  React.useEffect(() => {
    let hideConfirm: NodeJS.Timeout | undefined;
    if (viewConfirmDelete) {
      hideConfirm = setTimeout(() => {
        setViewConfirmDelete(false);
      }, 3000);
    } else {
      hideConfirm && clearTimeout(hideConfirm);
    }

    return () => hideConfirm && clearTimeout(hideConfirm);
  }, [viewConfirmDelete]);

  return (
    <ModalContainer>
      <div
        ref={ref}
        className="m-auto w-80 p-2 flex flex-col gap-2 bg-base rounded"
      >
        {/* Intent timestamps and stats */}
        <div className="flex flex-col gap-2 bg-window rounded p-3 text-sm inner-shadow">
          <p className="flex flex-row items-center justify-between">
            <span>Created at:</span>
            <span>{new Date(parseInt(data.created_at)).toLocaleString()}</span>
          </p>
          {data.archived_at ? (
            <p className="flex flex-row items-center justify-between">
              <span>Archived at:</span>
              <span>
                {new Date(parseInt(data.archived_at)).toLocaleString()}
              </span>
            </p>
          ) : null}
          <p className="flex flex-row items-center justify-between">
            <span>Total sessions:</span>
            <span>{sessions.length}</span>
          </p>
          <p className="flex flex-row items-center justify-between">
            <span>Total focus duration:</span>
            <span>{utils.formatTime(totalSessionsDuration)}</span>
          </p>
          <p className="flex flex-row items-center justify-between">
            <span>Average session duration:</span>
            <span>
              {sessions.length > 0
                ? (totalSessionsDuration / sessions.length).toFixed(1)
                : 0}
              min
            </span>
          </p>
        </div>
        {/* Intent Operations */}
        <div className="flex flex-row items-center justify-between h-7 gap-2">
          {data.archived_at ? (
            <Button
              style={{ width: "fit-content" }}
              onClick={() => services.unarchiveIntent(data.id)}
            >
              <BiArchiveOut size={24} />
              <span>Unarchive</span>
            </Button>
          ) : (
            <Button
              style={{ width: "fit-content" }}
              onClick={() => services.archiveIntent(data.id)}
            >
              <BiArchiveIn size={24} />
              <span>Archive</span>
            </Button>
          )}
          <DeleteButton onClick={() => services.deleteIntent(data.id)} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default DetailsModal;
