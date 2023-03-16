import React from "react";

const useConfirmDelete = () => {
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

  return {
    viewConfirmDelete,
    onDelete: (callback: () => void) => {
      if (viewConfirmDelete) {
        callback();
        setViewConfirmDelete(false);
      } else {
        setViewConfirmDelete(true);
      }
    },
  };
};

export default useConfirmDelete;
