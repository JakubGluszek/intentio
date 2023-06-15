import React from "react";

import { PanelView, PanelViewProps } from "./PanelView";

export const ConfigView: React.FC<PanelViewProps> = (props) => {
  return (
    <PanelView {...props}>Edit label, Edit tags, Archive, Delete</PanelView>
  );
};
