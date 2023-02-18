import React from "react";
import { useClickOutside } from "@mantine/hooks";

interface Props {
  hide: () => void;
  leftPosition: number;
  topPosition: number;
  children: React.ReactNode;
}

const ContextMenu: React.FC<Props> = (props) => {
  const [position, setPosition] = React.useState<{ left: number; top: number }>(
    { left: props.leftPosition, top: props.topPosition }
  );

  const ref = useClickOutside<HTMLDivElement>(() => props.hide());

  React.useEffect(() => {
    const root = document.getElementById("root")!;
    const padding = 8;

    let left = position.left;
    let top = position.top;

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
  }, []);

  return (
    <div
      ref={ref}
      style={{
        zIndex: 9999,
        position: "fixed",
        left: position.left,
        top: position.top,
      }}
      className="bg-window rounded shadow-lg shadow-black/60 text-sm p-0.5"
    >
      <div className="w-28 flex flex-col gap-0.5 overflow-clip rounded">
        {props.children}
      </div>
    </div>
  );
};

export default ContextMenu;
