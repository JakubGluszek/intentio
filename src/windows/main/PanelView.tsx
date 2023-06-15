import React from "react";

import { Glass } from "@/ui";

export interface PanelViewProps {
  display: boolean;
}

export const PanelView: React.FC<
  PanelViewProps & { children: React.ReactNode }
> = (props) => {
  return (
    <Glass
      className="grow flex flex-col p-0.5 rounded-sm"
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {props.children}
    </Glass>
  );
};
