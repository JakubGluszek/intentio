import React from "react";
import { IconType } from "react-icons";

import { WindowContext } from "@/contexts";

interface IconProps {
  icon: IconType;
  scale?: number;
}

/** Component must be inside WindowProvider in order to use it's context */
export const IconView: React.FC<IconProps> = (props) => {
  const { windowScale } = React.useContext(WindowContext)!;

  let iconSize = windowScale.iconSize;
  if (props.scale) {
    iconSize = iconSize * props.scale;
  }

  return (
    <props.icon
      size={iconSize}
      style={{ minWidth: iconSize, minHeight: iconSize }}
    />
  );
};
