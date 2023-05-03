import React from "react";
import { MdAddCircle } from "react-icons/md";

import ipc from "@/ipc";
import useStore from "@/store";
import { Script } from "@/bindings/Script";
import ScriptView from "./ScriptView";
import CreateScript from "./CreateScript";
import EditScript from "./EditScript";
import EditScriptEvents from "./EditScriptEvents";
import { Button, Pane } from "@/ui";

const ScriptsView: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);
  const [editScript, setEditScript] = React.useState<Script | null>(null);
  const [editScriptEvents, setEditScriptEvents] = React.useState<Script | null>(
    null
  );

  const store = useStore();

  React.useEffect(() => {
    ipc.getScripts().then((data) => store.setScripts(data));
  }, []);

  if (viewCreate) return <CreateScript onExit={() => setViewCreate(false)} />;
  if (editScript)
    return <EditScript data={editScript} onExit={() => setEditScript(null)} />;
  if (editScriptEvents)
    return (
      <EditScriptEvents
        data={editScriptEvents}
        onExit={() => setEditScriptEvents(null)}
      />
    );

  return (
    <Pane className="grow flex flex-col gap-2" padding="lg">
      <Button variant="base" onClick={() => setViewCreate(true)}>
        <MdAddCircle size={20} />
        <span>Create script</span>
      </Button>
      <div className="grow flex flex-col overflow-y-auto">
        <div className="max-h-0 overflow-y">
          <div className="flex flex-col gap-1.5 pb-1.5">
            {store.scripts.map((script) => (
              <ScriptView
                key={script.id}
                data={script}
                onEdit={() => setEditScript(script)}
                onEditEvents={() => setEditScriptEvents(script)}
              />
            ))}
          </div>
        </div>
      </div>
    </Pane>
  );
};

export default ScriptsView;
