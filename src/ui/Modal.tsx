import React from "react";
import { useClickOutside } from "@mantine/hooks";
import { clsx, ScrollArea } from "@mantine/core";
import { IconType } from "react-icons";
import { IconView } from "./IconView";

export interface ModalProps {
  children: React.ReactNode;
  display: boolean;
  header: {
    label: string;
    icon?: IconType;
  };
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
        "z-[500] fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center bg-darker/80",
        props.hidden && "opacity-0 pointer-events-none"
      )}
      data-tauri-disable-drag
    >
      <div
        ref={ref}
        style={{ width: "fit-content" }}
        className="flex flex-col rounded overflow-clip shadow-lg shadow-black/80 backdrop-blur-sm"
      >
        {/* Heading */}
        <div className="flex flex-row items-center p-1 py-1 gap-2 text-text/80 bg-base/30">
          {props.header?.icon && <IconView icon={props.header.icon} />}
          <span className="uppercase font-bold">{props.header.label}</span>
        </div>
        <ScrollArea.Autosize
          scrollbarSize={0}
          w={maxWidth}
          styles={{ viewport: { width: maxWidth, maxWidth } }}
          maxHeight={maxHeight}
        >
          <div className="flex flex-col bg-window/50 p-2 gap-1">
            {props.children}
          </div>
        </ScrollArea.Autosize>
      </div>
    </div>
  );
};
