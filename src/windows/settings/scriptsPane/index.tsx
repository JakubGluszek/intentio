import React from "react";
import { MdAddCircle } from "react-icons/md";

import ipc from "@/ipc";
import useStore from "@/store";
import { Button, Pane, ScrollArea } from "@/ui";
import { Script } from "@/bindings/Script";

import ScriptView from "./ScriptView";
import CreateScriptView from "./CreateScriptView";
import EditScript from "./EditScript";
import EditScriptEvents from "./EditScriptEvents";
import { useEvents } from "@/hooks";

const ScriptsPane: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);
  const [editScript, setEditScript] = React.useState<Script | null>(null);
  const [editScriptEvents, setEditScriptEvents] = React.useState<Script | null>(
    null
  );

  const store = useStore();

  useEvents({
    script_created: ({ data: id }) => {
      ipc.getScript(id).then((data) => store.addScript(data));
    },
    script_updated: ({ data: id }) => {
      ipc.getScript(id).then((data) => store.patchScript(id, data));
    },
    script_deleted: ({ data: id }) => store.removeScript(id),
  });

  React.useEffect(() => {
    ipc.getScripts().then((data) => store.setScripts(data));
  }, []);

  if (viewCreate)
    return <CreateScriptView onExit={() => setViewCreate(false)} />;
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
      <ScrollArea>
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
      </ScrollArea>
    </Pane>
  );
};

export default ScriptsPane;
