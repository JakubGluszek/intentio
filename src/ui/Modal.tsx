import React from "react";
import { useClickOutside } from "@mantine/hooks";
import { clsx, ScrollArea } from "@mantine/core";

export interface ModalProps {
  children: React.ReactNode;
  display: boolean;
  header: string;
  hidden?: boolean;
  onExit?: () => void;
}

export const Modal: React.FC<ModalProps> = (props) => {
  const [maxHeight, setMaxHeight] = React.useState(0);
  const [maxWidth, setMaxWidth] = React.useState(0);

  const ref = useClickOutside<HTMLDivElement>(() => props.onExit?.());

  React.useEffect(() => {
    function handleResize() {
      setMaxHeight(window.innerHeight - 64);
      setMaxWidth(window.innerWidth - 64);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!props.display) return null;

  return (
    <div
      className={clsx(
        "fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center bg-darker/50",
        props.hidden && "opacity-0 pointer-events-none"
      )}
      data-tauri-disable-drag
    >
      <div
        ref={ref}
        style={{ width: "fit-content" }}
        className="flex flex-col bg-window rounded overflow-clip border-2 border-primary/20"
      >
        {/* Heading */}
        <div className="flex flex-row items-center justify-between bg-primary/20 px-1 py-0.5 text-text/80">
          <span className="uppercase font-bold">{props.header}</span>
        </div>
        <ScrollArea.Autosize
          scrollbarSize={0}
          w={maxWidth}
          styles={{ viewport: { width: maxWidth, maxWidth } }}
          maxHeight={maxHeight}
        >
          <div className="flex flex-col gap-0.5 p-0.5">{props.children}</div>
        </ScrollArea.Autosize>
      </div>
    </div>
  );
};
