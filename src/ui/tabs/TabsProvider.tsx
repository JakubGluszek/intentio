import React from "react";

export type TabsProviderProps = {
  value: string;
  onChange: (value: string) => void;
};

export const TabsContext = React.createContext<TabsProviderProps | null>(null);

export const TabsProvider: React.FC<
  TabsProviderProps & { children: React.ReactNode }
> = (props) => {
  const { children, ...values } = props;

  return <TabsContext.Provider value={values}>{children}</TabsContext.Provider>;
};
