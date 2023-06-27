import React from "react";

import { PanelView, PanelViewProps } from "./PanelView";

export const HistoryView: React.FC<PanelViewProps> = (props) => {
  /*
  contents:
  
  Search input
  List of sessions
    Session
      Duration
      Timestamps
      Summary
    Total count
    If currently in focusing, display the session being created live as part of the list, add a on hover explain

  */

  return <PanelView {...props}>child</PanelView>;
};
