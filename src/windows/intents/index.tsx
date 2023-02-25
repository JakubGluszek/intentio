import React from "react";
import { BiTargetLock } from "react-icons/bi";
import { toast } from "react-hot-toast";

import useStore from "@/store";
import ipc from "@/ipc";
import { useEvents } from "@/hooks";
import { Layout, Titlebar } from "@/components";
import Sidebar from "./Sidebar";
import Dashboard from "./dashboard";
import IntentView from "./intentView";

const IntentsWindow: React.FC = () => {
  const [selectedId, setSelectedId] = React.useState<string>();
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const store = useStore();

  useEvents({
    intent_created: (data) => store.addIntent(data),
    intent_updated: (data) => store.patchIntent(data.id, data),
    intent_deleted: (data) => {
      store.removeIntent(data.id);
      toast("Intent deleted");
    },
    intent_archived: (data) => {
      store.patchIntent(data.id, data);
      if (data.id === selectedId) setSelectedId(undefined);
      toast("Intent has been archived");
    },
    intent_unarchived: (data) => {
      store.patchIntent(data.id, data);
      toast("Intent removed from archive");
    },
    session_saved: (data) => store.addSession(data),
    task_created: (data) => store.addTask(data),
    task_updated: (data) => store.patchTask(data.id, data),
    task_deleted: (data) => store.removeTask(data.id),
    tasks_deleted: (data) => data.map((task) => store.removeTask(task.id)),
    note_created: (data) => store.addNote(data),
    note_updated: (data) => store.patchNote(data.id, data),
    note_deleted: (data) => store.removeNote(data.id),
    notes_deleted: (data) => data.map((task) => store.removeNote(task.id)),
  });

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
    <Layout>
      <Titlebar icon={<BiTargetLock size={28} />} title="Intents" />
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
