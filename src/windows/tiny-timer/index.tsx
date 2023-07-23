import React from "react";

import { WindowContainer } from "@/components";

const TinyTimerWindow: React.FC = () => {
  return (
    <WindowContainer>
      <Content />
    </WindowContainer>
  );
};

const Content: React.FC = () => {
  return <Container>Tiny Timer</Container>;
};

interface ContainerProps {
  children: React.ReactNode;
}

// Minimum height of 200px issue on linux still not resolved.
const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="w-[15rem] h-[5rem]">
      <div className="relative w-full h-full flex flex-col bg-window/95 border-2 border-base/5 rounded-md overflow-clip">
        {children}
      </div>
    </div>
  );
};

export default TinyTimerWindow;
