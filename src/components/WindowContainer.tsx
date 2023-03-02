import React from "react";

import Layout from "./Layout";

interface Props {
  children: React.ReactNode;
}

const WindowContainer: React.FC<Props> = (props) => {
  return <Layout>{props.children}</Layout>;
};

export default WindowContainer;
