import React from "react";

import { Card, Pane } from "@/ui";

const GeneralView: React.FC = () => {
  return (
    <Pane className="grow flex flex-col">
      <HotkeysSection />
    </Pane>
  );
};

const HotkeysSection: React.FC = () => {
  return (
    <div className="flex flex-col gap-1">
      <h2>Hotkeys</h2>
      <Card className="flex flex-row items-center justify-between">
        <div>
          <span className="text-primary/80 font-semibold">Timer</span> -
          Start/Resume
        </div>
        <div className="w-12 p-1 bg-primary/20 text-center rounded-sm shadow-inner shadow-black/20">
          F1
        </div>
      </Card>
      <Card className="flex flex-row items-center justify-between">
        <div>
          <span className="text-primary/80 font-semibold">Timer</span> - Skip
        </div>
        <div className="w-12 p-1 bg-primary/20 text-center rounded-sm shadow-inner shadow-black/20">
          F2
        </div>
      </Card>
    </div>
  );
};

export default GeneralView;
