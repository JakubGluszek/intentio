import React from "react";
import { clsx } from "@mantine/core";

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
      <div className="w-full flex flex-row gap-0.5 rounded-sm">{children}</div>
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
    <button
      onClick={(e) => {
        context.onChange(props.value);
        props.onClick?.(e);
      }}
      className={clsx(
        "flex-1 flex flex-row items-center glass justify-center gap-1 font-black p-0.5 transition-colors duration-300 uppercase",
        selected
          ? "text-primary"
          : "text-text/80 hover:text-primary"
      )}
      tabIndex={-3}
    >
      {props.children}
    </button>
  );
};

Panels.Panel = Panel;
