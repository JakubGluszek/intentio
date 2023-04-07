import React from "react";
import { MdAddCircle } from "react-icons/md";

import { Button } from "@/components";
import ipc from "@/ipc";
import useStore from "@/store";
import ScriptView from "./ScriptView";
import CreateScriptView from "./CreateScriptView";

const ScriptsView: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);

  const store = useStore();

  React.useEffect(() => {
    ipc.getScripts().then((data) => store.setScripts(data));
  }, []);

  return (
    <div className="grow flex flex-col gap-3 p-2 window bg-window">
      {viewCreate === false ? (
        <div className="">
          <Button transparent onClick={() => setViewCreate(true)}>
            <MdAddCircle size={20} />
            <span> Add script</span>
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
