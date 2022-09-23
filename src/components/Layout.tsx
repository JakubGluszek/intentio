import React from "react";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return <div className="w-screen h-screen flex flex-col">{children}</div>;
};

export default Layout;
