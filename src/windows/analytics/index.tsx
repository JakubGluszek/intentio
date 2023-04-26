import React from "react";

import { Titlebar, WindowContainer } from "@/components";
import { MdAnalytics } from "react-icons/md";
import { Pane } from "@/ui";

const AnalyticsWindow: React.FC = () => {
  return (
    <WindowContainer>
      <div className="grow flex flex-col gap-0.5 rounded overflow-clip">
        <Titlebar title="Analytics" icon={<MdAnalytics size={24} />} />
        <Pane className="grow flex flex-col">
          <div>Analytics</div>
        </Pane>
      </div>
    </WindowContainer>
  );
};

export default AnalyticsWindow;
