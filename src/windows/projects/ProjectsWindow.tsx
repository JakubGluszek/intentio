import React from "react";
import { appWindow } from "@tauri-apps/api/window";
import { MdAddCircle, MdClose, MdDelete } from "react-icons/md";

import Layout from "../../components/Layout";
import { Project } from "../../bindings/Project";
import { ipc_invoke } from "../../ipc";
import useGlobal from "../../store";
import { ModelDeleteResultData } from "../../bindings/ModelDeleteResultData";
import { Settings } from "../../bindings/Settings";

const ProjectsWindow: React.FC = () => {
  const projects = useGlobal((state) => state.projects);
  const setProjects = useGlobal((state) => state.setProjects);
  const addProject = useGlobal((state) => state.addProject);
  const currentProject = useGlobal((state) => state.currentProject);
  const removeProject = useGlobal((state) => state.removeProject);

  const [viewCreate, setViewCreate] = React.useState(false);

  const createProject = (name: string) => {
    ipc_invoke<Project>("create_project", {
      data: { name: name.replaceAll(" ", "") },
    })
      .then((res) => {
        addProject(res.data);
        setViewCreate(false);
      })
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    ipc_invoke<Project[]>("get_projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.log(err));
  }, []);

  const deleteProject = async (id: string) => {
    const res = await ipc_invoke<ModelDeleteResultData>("delete_project", {
      id,
    });
    removeProject(res.data.id);
  };

  const updateCurrentProject = async (id: string) => {
    await ipc_invoke<Settings>("update_settings", {
      data: { current_project_id: id },
    });
  };

  return (
    <Layout>
      <div className="w-screen min-h-screen flex flex-col p-4 gap-2">
        <div
          data-tauri-drag-region
          className="flex flex-row items-center justify-between p-1"
        >
          <span className="text-lg">Projects</span>
          <button className="btn btn-ghost" onClick={() => appWindow.close()}>
            <MdClose size={32} />
          </button>
        </div>
        <div className="flex flex-col gap-4 p-1">
          {viewCreate ? (
            <div className="flex flex-row items-center gap-2">
              <input
                className="input"
                placeholder="Name"
                autoFocus
                type="text"
                onKeyUp={(e) =>
                  e.key === "Enter" && createProject(e.currentTarget.value)
                }
                minLength={1}
                maxLength={16}
              />
              <button
                className="btn btn-ghost"
                onMouseUp={() => setViewCreate(false)}
              >
                <MdClose size={24} />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-ghost justify-start gap-2"
              onMouseUp={() => setViewCreate(true)}
            >
              <MdAddCircle size={24} />
              <span>New Project</span>
            </button>
          )}
          <div className="flex flex-col gap-1">
            {projects.map((project) => (
              <ProjectView
                key={project.id}
                data={project}
                deleteProject={deleteProject}
                selectProject={updateCurrentProject}
                selected={currentProject?.id === project.id}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface ProjectViewProps {
  data: Project;
  deleteProject: (id: string) => void;
  selectProject: (id: string) => void;
  selected: boolean;
}

const ProjectView: React.FC<ProjectViewProps> = ({
  data,
  deleteProject,
  selectProject,
  selected,
}) => {
  const [viewDelete, setViewDelete] = React.useState(false);

  return (
    <div className="group flex flex-col gap-2">
      <div
        className={`group cursor-pointer flex flex-row items-center justify-between group-hover:bg-base rounded ${
          selected && "bg-base"
        }`}
      >
        <p
          className="w-full p-2"
          onMouseUp={async () => selectProject(data.id)}
        >
          {data.name}
        </p>
        <button
          className="btn btn-ghost px-2 text-text hidden group-hover:flex hover:text-primary"
          onMouseUp={() => setViewDelete(!viewDelete)}
        >
          <MdDelete size={24} />
        </button>
      </div>
      {viewDelete && (
        <div className="flex flex-col gap-1 text-sm text-center group-hover:bg-base rounded p-1 py-2">
          <p>Are you sure you want to delete this project?</p>
          <p>x focus hours will be lost.</p>
          <div className="flex flex-row items-center justify-between p-2">
            <button
              className="btn btn-ghost"
              onMouseUp={() => setViewDelete(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onMouseUp={async () => deleteProject(data.id)}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsWindow;
