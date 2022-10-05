import React from "react";

const WindowBorders: React.FC = () => {
  return (
    <>
      <div className="z-[100000] fixed bg-base top-0 w-full h-0.5"></div>
      <div className="z-[100000] fixed bg-base bottom-0 w-full h-0.5"></div>
      <div className="z-[100000] fixed bg-base left-0 h-full w-0.5"></div>
      <div className="z-[100000] fixed bg-base right-0 h-full w-0.5"></div>
    </>
  );
};

export default WindowBorders;
