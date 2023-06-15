import React from "react";
import { useClickOutside } from "@mantine/hooks";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

import { MenuPosition } from "@/hooks/useContextMenu";

export interface ContextMenuProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  display: boolean;
  position?: MenuPosition;
  hide: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = (props) => {
  const [position, setPosition] = React.useState<MenuPosition>({
    left: props.position?.left ?? -9999,
    top: props.position?.top ?? -9999,
  });

  const { className: customClassName, display, ...restProps } = props;

  const ref = useClickOutside<HTMLDivElement>(() => props.hide());

  let className =
    "w-28 flex flex-col gap-0.5 rounded-sm text-sm bg-window shadow-lg shadow-black/60";

  if (customClassName) {
    className = twMerge(className, customClassName);
  }

  React.useEffect(() => {
    if (!props.display) return;

    const root = document.getElementById("root")!;
    const padding = 8;

    let left = props.position?.left ?? position.left;
    let top = props.position?.top ?? position.top;

    // fix possible x overflow
    if (left + ref.current.clientWidth > root.clientWidth) {
      left =
        left - (left + ref.current.clientWidth - root.clientWidth) - padding;
    }
    // fix possible y overflow
    if (top + ref.current.clientHeight > root.clientHeight) {
      top =
        top - (top + ref.current.clientHeight - root.clientHeight) - padding;
    }

    setPosition({ left, top });
  }, [props.display, props.position]);

  return (
    <AnimatePresence>
      {display && (
        <motion.div
          className={className}
          ref={ref}
          style={{
            zIndex: 9999,
            position: "fixed",
            left: position.left,
            top: position.top,
          }}
          transition={{ duration: 0.3 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          {...restProps}
        >
          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
