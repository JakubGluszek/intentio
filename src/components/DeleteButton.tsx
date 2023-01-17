import React from "react";
import { MdDelete } from "react-icons/md";

import Button from "./Button";

interface Props {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const DeleteButton: React.FC<Props> = (props) => {
  const [viewConfirmDelete, setViewConfirmDelete] = React.useState(false);

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

  return !viewConfirmDelete ? (
    <Button
      transparent
      color="danger"
      onClick={() => setViewConfirmDelete(true)}
    >
      <MdDelete size={28} />
    </Button>
  ) : (
    <Button
      color="danger"
      style={{ width: "fit-content" }}
      onClick={(e) => props.onClick(e)}
    >
      <MdDelete size={24} />
      <span>Confirm</span>
    </Button>
  );
};

export default DeleteButton;
