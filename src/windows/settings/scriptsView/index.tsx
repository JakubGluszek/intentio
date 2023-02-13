import React from "react";

import { Button } from "@/components";
import services from "@/services";
import useStore from "@/store";
import ScriptView from "./ScriptView";
import CreateScriptView from "./CreateScriptView";

const ScriptsView: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);

  const store = useStore();

  React.useEffect(() => {
    services.getScripts().then((data) => store.setScripts(data));
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {viewCreate === false ? (
        <div className="">
          <Button transparent onClick={() => setViewCreate(true)}>
            Add script
          </Button>
        </div>
      ) : (
        <CreateScriptView exit={() => setViewCreate(false)} />
      )}
      <div className="flex flex-col gap-1.5">
        {store.scripts.map((script) => (
          <ScriptView key={script.id} data={script} />
        ))}
      </div>
    </div>
  );
};

export default ScriptsView;
