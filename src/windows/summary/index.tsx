import React from "react";

import { WindowContainer } from "@/components";

const SummaryWindow: React.FC = () => {
  return (
    <WindowContainer>
      <Content />
    </WindowContainer>
  );
};

const Content: React.FC = () => {
  return <div>Summary here</div>;
};

export default SummaryWindow;
