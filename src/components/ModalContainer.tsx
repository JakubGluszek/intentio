import React, { ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  children: ReactNode;
  hide?: () => void;
}

const ModalContainer: React.FC<Props> = ({ children, hide }) => {
  React.useEffect(() => {
    const handleOnKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide && hide();
    };

    document.addEventListener("keydown", handleOnKeyDown);
    return () => document.removeEventListener("keydown", handleOnKeyDown);
  }, [hide]);

  return createPortal(
    <div className="z-[1337420] fixed top-0 left-0 w-screen h-screen flex flex-col bg-darker/60 p-8 animate-in fade-in-0">
      {children}
    </div>,
    document.getElementById("root")!
  );
};

export default ModalContainer;
