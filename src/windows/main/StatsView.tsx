import React from "react";

import { PanelView, PanelViewProps } from "./PanelView";

export const StatsView: React.FC<PanelViewProps> = (props) => {
  /*
  remarks:
  ? aim for a banner like page, "shareable" in a sense that you can screenshot it & save it to disk / copy

  contents: 
  Today
    Card -> Swap on press (or have a toggle option on top to work on all three cards)
       Sessions
       Hours
  Total
    Card -> Swap on press
       Sessions
       Hours
  Best day
    Card -> Swap on press
       Sessions
       Hours
  Percentage of total intents hours
    Fire emote, it's color opacity based on percentage

  Created at timestamp
  Day Streak
  */

  return <PanelView {...props}>child</PanelView>;
};
