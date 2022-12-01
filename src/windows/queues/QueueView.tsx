import React from "react";
import {
  MdAddCircle,
  MdDelete,
  MdDragIndicator,
  MdPlayCircle,
} from "react-icons/md";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { arrayMoveImmutable } from "array-move";
import { appWindow } from "@tauri-apps/api/window";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import toast from "react-hot-toast";

import { Queue } from "../../bindings/Queue";
import { QueueSession } from "../../bindings/QueueSession";
import useGlobal from "../../app/store";
import CreateSessionView from "./CreateSessionView";
import { ipc_invoke } from "../../app/ipc";
import { ModelDeleteResultData } from "../../bindings/ModelDeleteResultData";
import { SessionQueue } from "../../bindings/SessionQueue";
import Button from "../../components/Button";

interface Props {
  data: Queue;
}

const QueueView: React.FC<Props> = ({ data }) => {
  const [viewCreateSession, setViewCreateSession] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const updateQueue = useGlobal((state) => state.updateQueue);
  const removeQueue = useGlobal((state) => state.removeQueue);

  const [containerRef] = useAutoAnimate<HTMLDivElement>();

  const startQueue = () => {
    if (data.sessions.length === 0) {
      toast("Add some sessions");
      return;
    }
    ipc_invoke<SessionQueue>("set_session_queue", {
      data: {
        ...data,
        iterations: 1,
        session_idx: 0,
        session_cycle: 1,
      },
    }).catch((err) => console.log(err));

    appWindow.close();
  };

  const saveSession = (session: QueueSession) => {
    ipc_invoke<Queue>("update_queue", {
      id: data.id,
      data: { ...data, sessions: [...data.sessions, session] },
    })
      .then((res) => {
        updateQueue(res.data);
        toast("Session added");
      })
      .catch((err) => console.log(err));
  };

  /** Delete the current queue */
  const remove = () => {
    ipc_invoke<ModelDeleteResultData>("delete_queue", { id: data.id })
      .then((res) => {
        removeQueue(res.data.id);
        toast("Queue deleted");
      })
      .catch((err) => console.log(err));
  };

  const removeSession = (id: string) => {
    ipc_invoke<Queue>("update_queue", {
      id: data.id,
      data: { ...data, sessions: data.sessions.filter((s) => s.id !== id) },
    })
      .then((res) => {
        updateQueue(res.data);
        toast("Session removed");
      })
      .catch((err) => console.log(err));
  };

  const triggerConfirmDelete = () => {
    setConfirmDelete(true);
    setTimeout(() => {
      setConfirmDelete(false);
    }, 1600);
  };

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const sessions = arrayMoveImmutable(
      data.sessions,
      result.source.index,
      result.destination.index
    );

    ipc_invoke<Queue>("update_queue", {
      id: data.id,
      data: { ...data, sessions },
    })
      .then((res) => updateQueue(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-col gap-4 rounded p-2">
      <div className="flex flex-row items-center justify-between">
        <span className="text-xl">{data.name}</span>
        <div className="flex flex-row items-center gap-2">
          <Button transparent onClick={() => startQueue()}>
            <MdPlayCircle size={32} />
          </Button>
          <Button
            transparent={!confirmDelete}
            onClick={() => (confirmDelete ? remove() : triggerConfirmDelete())}
          >
            <MdDelete size={32} />
            {confirmDelete && <span className="text-sm">Confirm</span>}
          </Button>
        </div>
      </div>
      <div ref={containerRef} className="flex flex-col gap-4">
        {!viewCreateSession ? (
          <Button onClick={() => setViewCreateSession(true)}>
            <MdAddCircle size={24} />
            <span>Add a session</span>
          </Button>
        ) : (
          <CreateSessionView
            hide={() => setViewCreateSession(false)}
            save={(session: QueueSession) => {
              saveSession(session);
              setViewCreateSession(false);
            }}
          />
        )}
        {/* Sessions */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-2"
              >
                {data.sessions.map((session, index) => (
                  <Draggable
                    key={session.id}
                    draggableId={session.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <SessionView
                        key={session.id}
                        data={session}
                        remove={() => removeSession(session.id)}
                        snapshot={snapshot}
                        innerRef={provided.innerRef}
                        draggableProps={provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    )}
                  </Draggable>
                ))}
                {data.sessions.length === 0 && (
                  <span className="text-center p-2">No sessions</span>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

interface SessionViewProps {
  data: QueueSession;
  remove: () => void;
  snapshot: DraggableStateSnapshot;
  innerRef: (element?: HTMLElement | null | undefined) => any;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | undefined;
}

const SessionView: React.FC<SessionViewProps> = ({
  data,
  remove,
  snapshot,
  innerRef,
  draggableProps,
  dragHandleProps,
}) => {
  const getProjectById = useGlobal((state) => state.getProjectById);

  return (
    <div
      id={data.id}
      ref={innerRef}
      {...draggableProps}
      className={`relative group flex flex-row gap-2 text-center rounded bg-base p-2 ${
        snapshot.isDragging ? "shadow-xl" : "shadow-none"
      }`}
    >
      <div {...dragHandleProps}>
        <MdDragIndicator size={24} />
      </div>
      <div className="flex-1 items-center justify-center">
        {getProjectById(data.project_id)?.name ?? "-"}
      </div>
      <div className="flex-1 items-center justify-center">
        {data.duration} min
      </div>
      <div className="flex-1 items-center justify-center">{data.cycles}x</div>
      <div className="absolute top-[3px] right-2 transition-opacity opacity-0 group-hover:opacity-100">
        <Button transparent onClick={() => remove()}>
          <MdDelete size={24} />
        </Button>
      </div>
    </div>
  );
};

export default QueueView;
