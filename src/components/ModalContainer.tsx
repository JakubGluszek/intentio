import React, { ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  children: ReactNode;
}

const ModalContainer: React.FC<Props> = ({ children }) => {
  return createPortal(
    <div className="z-[1337420] fixed top-0 left-0 w-screen h-screen flex flex-col bg-darker/60">
      {children}
    </div>,
    document.getElementById("root")!
  );
};

export default ModalContainer;
