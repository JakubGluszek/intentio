import React from "react";
import { MdInfo } from "react-icons/md";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { clsx, Popover, ScrollArea } from "@mantine/core";

import { IconView } from "./IconView";

export interface ModalProps {
  children: React.ReactNode;
  display: boolean;
  header: string;
  description?: string;
  hidden?: boolean;
  onExit?: () => void;
}

export const Modal: React.FC<ModalProps> = (props) => {
  const ref = useClickOutside<HTMLDivElement>(() => props.onExit?.());

  if (!props.display) return null;

  return (
    <div
      className={clsx(
        "absolute left-0 top-0 p-6 w-screen h-screen flex flex-col bg-black/50",
        props.hidden && "opacity-0 pointer-events-none"
      )}
      data-tauri-disable-drag
    >
      {/* Modal */}
      <div
        ref={ref}
        className="m-auto w-full h-fit bg-window rounded border border-base/5 overflow-clip"
      >
        {/* Heading */}
        <div className="flex flex-row items-center justify-between bg-base/5 px-1 py-0.5 text-text/60">
          <span className="uppercase font-semibold">{props.header}</span>
          {props.description && <About content={props.description} />}
        </div>
        {/* Wrapper */}
        <div className="flex flex-col p-0.5">
          {/* Content */}
          <div className="flex flex-col gap-0.5 rounded-t-sm rounded-b overflow-clip">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AboutProps {
  content: string;
}

const About: React.FC<AboutProps> = (props) => {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <Popover
      opened={opened}
      shadow="md"
      position="left"
      width={248}
      classNames={{
        dropdown: "bg-window border-base/5 p-1 px-2 text-xs text-text/80",
      }}
    >
      <Popover.Target>
        <div onMouseOver={open} onMouseLeave={close}>
          <IconView icon={MdInfo} />
        </div>
      </Popover.Target>
      <Popover.Dropdown>{props.content}</Popover.Dropdown>
    </Popover>
  );
};
