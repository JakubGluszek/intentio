import React from "react";
import { motion, HTMLMotionProps, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { MdMoreVert } from "react-icons/md";

import { Button, Card } from "@/ui";
import { Intent } from "@/bindings/Intent";
import { useClickOutside } from "@mantine/hooks";
import { clsx } from "@mantine/core";

export interface IntentViewProps extends HTMLMotionProps<"div"> {
  data: Intent;
  disabled?: boolean;
  onViewContext?: () => void;
  onExitContext?: () => void;
}

export const IntentView: React.FC<IntentViewProps> = (props) => {
  const {
    data,
    disabled,
    onViewContext,
    onExitContext,
    onClick,
    className: customClassName,
    ...restProps
  } = props;

  const [viewContext, setViewContext] = React.useState(false);

  const promptMenuRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <React.Fragment>
      <Card
        onMouseDown={(e) => {
          if (disabled) return;
          // @ts-ignore
          !e.target.closest("button") && onClick?.(e);
        }}
        className={twMerge(
          "py-0.5 text-lg font-semibold",
          "hover:border-primary/40 hover:shadow-lg hover:shadow-black/30",
          !disabled && "active:text-primary active:border-primary/60",
          customClassName
        )}
        data-tauri-disable-drag
        {...restProps}
      >
        <div className="flex flex-row items-center justify-between">
          <div>{data.label}</div>
          <div className="flex flex-row gap-1">
            <Button
              onMouseUp={() => {
                setViewContext(true);
                onViewContext?.();
              }}
              ref={promptMenuRef}
              variant="ghost"
              className={clsx("p-0", viewContext && "text-primary")}
            >
              <MdMoreVert size={24} />
            </Button>
          </div>
        </div>
      </Card>

      <ContextMenu
        display={viewContext}
        onExit={() => {
          setViewContext(false);
          onExitContext?.();
        }}
        relativeRef={promptMenuRef}
      >
        <div className="bg-darker/80 backdrop-blur-lg">
          <Button variant="base" className="w-full">
            Details
          </Button>
        </div>
        <div className="bg-darker/80 backdrop-blur-lg">
          <Button variant="base" className="w-full">
            Edit
          </Button>
        </div>
      </ContextMenu>
    </React.Fragment>
  );
};

interface ContextMenuProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  relativeRef: React.MutableRefObject<HTMLButtonElement | null>;
  display: boolean;
  onExit: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = (props) => {
  const {
    children,
    relativeRef,
    display,
    onExit,
    className: customClassName,
    ...restProps
  } = props;

  const [position, setPosition] = React.useState<{ x: number; y: number }>();
  const ref = useClickOutside<HTMLDivElement>(() => onExit());

  let padding = 0;

  React.useEffect(() => {
    if (relativeRef.current && ref.current) {
      let relativePosition = {
        x: relativeRef.current.offsetLeft,
        y: relativeRef.current.offsetTop,
      };

      setPosition({
        x: relativePosition.x - (ref.current.offsetWidth + padding),
        y: relativePosition.y + padding,
      });
    }
  }, [display]);

  return (
    <AnimatePresence>
      {display && (
        <motion.div
          ref={ref}
          className={twMerge(
            "w-28 flex flex-col gap-0.5 rounded-sm overflow-clip shadow-xl shadow-black/60",
            customClassName
          )}
          style={{
            zIndex: 999999,
            position: "fixed",
            top: position?.y ?? -9999,
            left: position?.x ?? -9999,
          }}
          transition={{ duration: 0.15 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          {...restProps}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
