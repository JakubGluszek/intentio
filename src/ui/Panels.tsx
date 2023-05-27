import React from "react";
import { clsx } from "@mantine/core";
import { Glass } from "./Glass";

type IPanelsContext = {
  value: string;
  onChange: (value: string) => void;
};

interface PanelsProps extends IPanelsContext {
  children: React.ReactNode;
}

interface PanelsComposition {
  Panel: typeof Panel;
}

const PanelsContext = React.createContext<IPanelsContext | null>(null);

const PanelsProvider: React.FC<PanelsProps> = (props) => {
  const { children, ...restProps } = props;

  return (
    <PanelsContext.Provider value={restProps}>
      {children}
    </PanelsContext.Provider>
  );
};

export const Panels: React.FC<PanelsProps> & PanelsComposition = (props) => {
  const { children, ...restProps } = props;

  return (
    <PanelsProvider {...restProps}>
      <div className="w-full flex flex-row gap-0.5">
        {children}
      </div>
    </PanelsProvider>
  );
};

interface PanelProps extends React.ComponentProps<"button"> {
  value: string;
}

const Panel: React.FC<PanelProps> = (props) => {
  const context = React.useContext(PanelsContext)!;

  const selected = context.value === props.value;

  return (
    <Glass
      className="grow flex flex-row overflow-clip"
      whileTap={{ scale: 0.95, borderRadius: 4 }}
    >
      <button
        onClick={(e) => {
          context.onChange(props.value);
          props.onClick?.(e);
        }}
        className={clsx(
          "grow flex flex-row items-center justify-center gap-1 bg-base/10 font-black p-0.5 transition-colors duration-300 uppercase",
          selected
            ? "text-primary border-b-2 border-primary"
            : "text-text/80 hover:text-primary"
        )}
        tabIndex={-3}
      >
        {props.children}
      </button>
    </Glass>
  );
};

Panels.Panel = Panel;
