import React from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { Intent } from "@/bindings/Intent";

import { IntentView } from "./IntentView";

export interface IntentsListProps extends HTMLMotionProps<"div"> {
  data?: Intent[];
}

export const IntentsList: React.FC<IntentsListProps> = (props) => {
  const { data, ...restProps } = props;

  const [disableIntents, setDisableIntents] = React.useState(false);

  let className = "flex flex-col gap-1";

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div className={className} {...restProps}>
      {data.map((intent) => (
        <IntentView
          key={intent.id}
          data={intent}
          onClick={(e) => null}
          disabled={disableIntents}
          onViewContext={() => setDisableIntents(true)}
          onExitContext={() => setDisableIntents(false)}
        />
      ))}
    </motion.div>
  );
};

export interface useIntentsListProps {
  data?: Intent[];
}

export const useIntentsList = (
  props: useIntentsListProps
): IntentsListProps => {
  // handle & expose current intent state
  // handle & expose selected intents
  // if data not provided, check store, if story empty, perform ipc call
  //
  return { data: props.data };
};
