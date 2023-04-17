import React from "react";

import { TabsProvider, TabsProviderProps } from "./TabsProvider";
import { Tab } from "./Tab";

export interface TabsProps extends TabsProviderProps {
  children: React.ReactNode;
}

interface TabsComposition {
  Tab: typeof Tab;
}

export const Tabs: React.FC<TabsProps> & TabsComposition = (props) => {
  const { children, ...values } = props;

  return (
    <TabsProvider {...values}>
      <div className="w-full flex flex-row p-1 gap-0.5">{children}</div>
    </TabsProvider>
  );
};

Tabs.Tab = Tab;
