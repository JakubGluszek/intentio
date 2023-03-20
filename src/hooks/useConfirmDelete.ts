import React from "react";

const useConfirmDelete = (callback: () => void) => {
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

  const onDelete = React.useCallback(() => {
    if (viewConfirmDelete) {
      callback();
      setViewConfirmDelete(false);
    } else {
      setViewConfirmDelete(true);
    }
  }, [callback, viewConfirmDelete]);

  return {
    viewConfirmDelete,
    onDelete: onDelete,
  };
};

export default useConfirmDelete;
