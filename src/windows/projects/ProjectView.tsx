import React from "react";
import { MdDelete } from "react-icons/md";
import autoAnimate from "@formkit/auto-animate";
import { invoke } from "@tauri-apps/api/tauri";
import { toast } from "react-hot-toast";

import { Project } from "@/bindings/Project";
import Button from "@/components/Button";
import { ipc_invoke } from "@/app/ipc";
import { ModelDeleteResultData } from "@/bindings/ModelDeleteResultData";

interface Props {
  data: Project;
  selected: boolean;
}

const ProjectView: React.FC<Props> = ({ data, selected }) => {
  const [viewDelete, setViewDelete] = React.useState(false);

  const delRef = React.useRef<HTMLDivElement | null>(null);
  const parent = React.useRef<HTMLDivElement | null>(null);

  const selectProject = async (project: Project | undefined) => {
    await invoke("set_current_project", {
      data: project,
    });
  };

  const deleteProject = async (id: string) => {
    ipc_invoke<ModelDeleteResultData>("delete_project", {
      id,
    }).then(() => toast("Project deleted"));
  };

  React.useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  React.useEffect(() => {
    if (viewDelete) {
      delRef.current?.scrollIntoView({ block: "center" });
    }
  }, [viewDelete]);

  return (
    <div
      ref={parent}
      className="group flex flex-col gap-2 bg-base rounded overflow-clip"
      data-tauri-disable-drag
    >
      <div
        className={`group cursor-pointer flex flex-row items-center justify-between transition-colors ${
          selected && "bg-primary text-window"
        }`}
      >
        <p
          className="w-full p-2 cursor-pointer"
          onClick={async () => selectProject(!selected ? data : undefined)}
        >
          {data.name}
        </p>
        <div className="mr-2">
          <Button
            transparent
            onClick={() => setViewDelete(!viewDelete)}
            style={{ color: selected ? "var(--window-color)" : undefined }}
          >
            <MdDelete size={24} />
          </Button>
        </div>
      </div>
      {viewDelete && (
        <div
          ref={delRef}
          className="flex flex-col gap-2 text-sm text-center p-1 py-2"
        >
          <p>Are you sure you want to delete this project?</p>
          <p>Focused hours will get orphaned.</p>
          <div className="flex flex-row items-center justify-between p-2">
            <Button
              transparent
              style={{ marginLeft: 8 }}
              onClick={() => setViewDelete(false)}
            >
              Cancel
            </Button>
            <Button onClick={async () => deleteProject(data.id)}>
              Confirm
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectView;
