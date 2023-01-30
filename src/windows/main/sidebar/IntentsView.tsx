import React from "react";

import useStore from "@/store";
import IntentsList from "@/windows/intents/IntentsList";
import { Intent } from "@/bindings/Intent";
import services from "@/services";

const IntentsView: React.FC = () => {
  const [selectedIntentTags, setSelectedIntentTags] = React.useState<string[]>(
    []
  );

  const store = useStore();

  const onIntentChange = async (data: Intent | undefined) => {
    await services.setActiveIntentId(data?.id).then(() => {
      store.setActiveIntentId(data?.id);
    });
  };

  return store.intents.length > 0 ? (
    <IntentsList
      data={store.intents.filter(
        (intent) =>
          intent.archived_at === null || intent.archived_at === undefined
      )}
      selectedIntentId={store.activeIntentId}
      selectedTags={selectedIntentTags}
      onSelected={onIntentChange}
      onTagSelected={(data) => setSelectedIntentTags(data)}
    />
  ) : (
    <div className="m-auto text-sm text-text/80 text-center">
      <p>There are no defined intents</p>
    </div>
  );
};

export default IntentsView;
