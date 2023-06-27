import React from "react";
import { useClickOutside } from "@mantine/hooks";

interface ModalProps {
  children: React.ReactNode;
  display: boolean;
  header: string;
  onExit: () => void;
}

export const Modal: React.FC<ModalProps> = (props) => {
  const ref = useClickOutside<HTMLDivElement>(() => props.onExit());

  if (!props.display) return null;

  return (
    <div className="fixed left-0 top-0 p-8 w-screen h-screen flex flex-col bg-black/50">
      {/* Modal */}
      <div
        ref={ref}
        className="m-auto w-full bg-window border border-primary/10 rounded overflow-clip"
      >
        {/* Heading */}
        <div className="flex flex-row bg-primary/10 px-1 py-0.5">
          <span className="uppercase font-semibold text-text/60">
            {props.header}
          </span>
        </div>
        {/* Wrapper */}
        <div className="flex flex-col p-1">
          {/* Content */}
          <div className="flex flex-col gap-1 rounded-t-sm rounded-b overflow-clip">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};
