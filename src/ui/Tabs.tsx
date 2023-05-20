import React from "react";
import { clsx } from "@mantine/core";
import { HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";

import { Button } from "@/ui";

type TabsProviderProps = {
  value: string;
  onChange: (value: string) => void;
};

const TabsContext = React.createContext<TabsProviderProps | null>(null);

const TabsProvider: React.FC<
  TabsProviderProps & { children: React.ReactNode }
> = (props) => {
  const { children, ...restProps } = props;

  return (
    <TabsContext.Provider value={restProps}>{children}</TabsContext.Provider>
  );
};

interface TabsProps extends TabsProviderProps {
  children: React.ReactNode;
}

interface TabsComposition {
  Tab: typeof Tab;
}

export const Tabs: React.FC<TabsProps> & TabsComposition = (props) => {
  const { children, ...values } = props;

  return (
    <TabsProvider {...values}>
      <div className="w-full flex flex-row gap-1 p-0.5">{children}</div>
    </TabsProvider>
  );
};

interface TabProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  value: string;
}

const Tab: React.FC<TabProps> = (props) => {
  const { children, value, className: customClassName, ...restProps } = props;

  const cx = React.useContext(TabsContext);
  const isSelected = cx?.value === props.value;

  let className = clsx(
    "grow duration-150 active:bg-primary active:text-window",
    isSelected
      ? "bg-primary/80 hover:bg-primary/90 text-window hover:text-window shadow-lg shadow-black/40"
      : "bg-primary/20 hover:bg-primary/30 text-primary hover:text-primary shadow shadow-black/40"
  );

  if (customClassName) {
    className = twMerge(className, customClassName);
  }

  return (
    <Button
      variant="ghost"
      onClick={() => cx?.onChange(props.value)}
      className={className}
      {...restProps}
    >
      {props.children}
    </Button>
  );
};

Tabs.Tab = Tab;
