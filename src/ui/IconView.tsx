import React from "react";
import { IconType } from "react-icons";

import { WindowContext } from "@/contexts";

interface IconProps {
  icon: IconType;
}

/** Component must be inside WindowProvider in order to use it's context */
export const IconView: React.FC<IconProps> = (props) => {
  const { windowScale } = React.useContext(WindowContext)!;
  const iconSize = windowScale.iconSize;

  return <props.icon size={iconSize} />;
};
