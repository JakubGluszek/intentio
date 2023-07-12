import React from "react";
import { WebviewWindow } from "@tauri-apps/api/window";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  MdAnalytics,
  MdCheckBox,
  MdClose,
  MdHistory,
  MdRemove,
  MdSettings,
  MdTimer,
} from "react-icons/md";
import { clsx } from "@mantine/core";
import { HiViewList } from "react-icons/hi";
import { BiTargetLock } from "react-icons/bi";

import config from "@/config";
import ipc from "@/ipc";
import { Button, IconView } from "@/ui";
import { useTimer } from "@/hooks";

export const MainLayout: React.FC = () => {
  return (
    <div className="w-[20rem] h-[21rem]">
      <div className="relative w-screen h-screen flex flex-col bg-window/95 border-2 border-base/5 rounded-md overflow-clip">
        {/* Titlebar */}
        <div className="flex flex-row items-center h-8 p-0.5 bg-base/5">
          <div className="flex flex-row gap-1">
            <Button
              variant="ghost"
              onClick={() =>
                new WebviewWindow("settings", config.windows.settings)
              }
            >
              <IconView icon={MdSettings} />
            </Button>
            <Button variant="ghost" disabled>
              <IconView icon={MdAnalytics} />
            </Button>
          </div>
          <div className="w-full text-center font-bold text-lg text-text/80">
            Intentio
          </div>
          <div className="flex flex-row gap-1">
            <Button variant="ghost" onClick={() => ipc.hideMainWindow()}>
              <IconView icon={MdRemove} />
            </Button>
            <Button variant="ghost" onClick={() => ipc.exitMainWindow()}>
              <IconView icon={MdClose} />
            </Button>
          </div>
        </div>
        <div className="relative grow flex flex-col p-0.5">
          <div className="grow flex flex-col gap-0.5">
            <Outlet />
            <Navbar />
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const timer = useTimer();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!timer.session) return null;

  return (
    <div className="h-7 flex flex-row rounded-[1px]">
      <NavButton onClick={() => null}>
        <IconView icon={HiViewList} />
      </NavButton>
      <NavButton onClick={() => null}>
        <IconView icon={MdCheckBox} />
      </NavButton>
      <NavButton
        isSelected={pathname === "/timer"}
        onClick={() => navigate("/timer")}
      >
        <IconView icon={MdTimer} />
      </NavButton>
      <NavButton onClick={() => null}>
        <IconView icon={MdHistory} />
      </NavButton>
      <NavButton
        isSelected={pathname === "/intents"}
        onClick={() => navigate("/intents")}
      >
        <IconView icon={BiTargetLock} />
      </NavButton>
    </div>
  );
};

interface NavButtonProps {
  children: React.ReactNode;
  isSelected?: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({
  children,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
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
