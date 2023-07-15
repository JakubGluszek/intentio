import React from "react";
import { Loader as MantineLoader } from "@mantine/core";

export const Loader: React.FC = () => {
  return (
    <div className="grow flex flex-col items-center justify-center">
      <MantineLoader stroke="rgb(var(--primary-color))" />
    </div>
  );
};
