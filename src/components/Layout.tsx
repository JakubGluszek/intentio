import React from "react";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div className="z-[100000] fixed bg-base top-0 w-full h-0.5"></div>
      <div className="z-[100000] fixed bg-base bottom-0 w-full h-0.5"></div>
      <div className="z-[100000] fixed bg-base left-0 h-full w-0.5"></div>
      <div className="z-[100000] fixed bg-base right-0 h-full w-0.5"></div>

      {children}
    </>
  );
};

export default Layout;
