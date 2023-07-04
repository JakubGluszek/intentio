import React from "react";
import { BiTargetLock } from "react-icons/bi";
import { HiViewList } from "react-icons/hi";
import { MdCheckBox, MdHistory, MdTimer } from "react-icons/md";
import { clsx } from "@mantine/core";

import { IconView } from "@/ui";

interface MainWrapperProps {
  children: React.ReactNode;
}

export const MainWrapper: React.FC<MainWrapperProps> = (props) => {
  return (
    <div className="relative grow flex flex-col p-0.5">
      <div className="grow flex flex-col gap-0.5">
        {props.children}

        {/* Intent Panels */}
        <div className="h-7 flex flex-row rounded-[1px]">
          <PanelButton>
            <IconView icon={HiViewList} />
          </PanelButton>
          <PanelButton>
            <IconView icon={MdCheckBox} />
          </PanelButton>
          <PanelButton>
            <IconView icon={MdTimer} />
          </PanelButton>
          <PanelButton>
            <IconView icon={MdHistory} />
          </PanelButton>
          <PanelButton isSelected>
            <IconView icon={BiTargetLock} />
          </PanelButton>
        </div>
      </div>
    </div>
  );
};

interface PanelButtonProps {
  children: React.ReactNode;
  isSelected?: boolean;
}

const PanelButton: React.FC<PanelButtonProps> = ({ children, isSelected }) => {
  return (
    <button
      className={clsx(
        "flex-1 flex flex-row items-center justify-center hover:shadow-black/10 hover:shadow active:shadow-black/20 active:shadow-lg active:scale-95 transition-all duration-150 first:rounded-bl last:rounded-br border-y border-base/5 first:border-l last:border-r",
        isSelected
          ? "bg-primary/20 hover:bg-primary/30 text-primary border-b-2 border-y-0 first:border-l-0 last:border-r-0 border-primary"
          : "bg-base/5 hover:bg-base/10 text-text/80 hover:text-base active:text-primary"
      )}
    >
      {children}
    </button>
  );
};
