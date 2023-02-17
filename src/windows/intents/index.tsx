import React from "react";
import { BiTargetLock } from "react-icons/bi";
import { toast } from "react-hot-toast";

import { useEvent } from "@/hooks";
import ipc from "@/ipc";
import Layout from "@/components/Layout";
import Sidebar from "./Sidebar";
import Dashboard from "./dashboard";
import IntentView from "./intentView";
import useStore from "@/store";

const IntentsWindow: React.FC = () => {
  const [selectedId, setSelectedId] = React.useState<string>();
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const store = useStore();

  useEvent("intent_created", (event) => store.addIntent(event.payload));
  useEvent("intent_updated", (event) =>
    store.patchIntent(event.payload.id, event.payload)
  );
  useEvent("intent_deleted", (event) => {
    store.removeIntent(event.payload.id);
    toast("Intent deleted");
  });
  useEvent("intent_archived", (event) => {
    store.patchIntent(event.payload.id, event.payload);
    toast("Intent has been archived");
  });
  useEvent("intent_unarchived", (event) => {
    store.patchIntent(event.payload.id, event.payload);
    toast("Intent removed from archive");
  });
  useEvent("session_saved", (event) => store.addSession(event.payload));
  useEvent("task_created", (event) => store.addTask(event.payload));
  useEvent("task_updated", (event) =>
    store.patchTask(event.payload.id, event.payload)
  );
  useEvent("task_deleted", (event) => store.removeTask(event.payload.id));
  useEvent("tasks_deleted", (event) =>
    event.payload.map((task) => store.removeTask(task.id))
  );
  useEvent("note_created", (event) => store.addNote(event.payload));
  useEvent("note_updated", (event) =>
    store.patchNote(event.payload.id, event.payload)
  );
  useEvent("note_deleted", (event) => store.removeNote(event.payload.id));
  useEvent("notes_deleted", (event) =>
    event.payload.map((task) => store.removeNote(task.id))
  );

  React.useEffect(() => {
    ipc
      .getIntents()
      .then((data) => store.setIntents(data))
      .catch((err) => console.log("getIntents", err));
    ipc.getSessions().then((data) => store.setSessions(data));
    ipc.getTasks().then((data) => store.setTasks(data));
    ipc.getNotes().then((data) => store.setNotes(data));
  }, []);

  const intent = store.getIntentById(selectedId);

  return (
    <Layout icon={<BiTargetLock size={28} />} label="Intents">
      <div className="grow flex flex-row">
        <Sidebar
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
        {intent ? (
          <IntentView
            data={intent}
            sessions={store.sessions.filter(
              (session) => session.intent_id === selectedId
            )}
          />
        ) : (
          <Dashboard
            sessions={store.sessions}
            intents={store.intents}
            tags={selectedTags}
          />
        )}
      </div>
    </Layout>
  );
};

export default IntentsWindow;
