import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import React from "react";
import { MdAddCircle, MdClose, MdDelete, MdEdit } from "react-icons/md";
import useTheme from "../hooks/useTheme";
import { Project } from "../types";

const ProjectsWindow: React.FC = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const { changeTheme } = useTheme();

  React.useEffect(() => {
    listen<string>("apply_theme", (event) =>
      changeTheme(JSON.parse(event.payload))
    );
  }, []);

  const createProject = () => {
    invoke<Project[]>("save_project", { title: "new project" }).then(
      (projects) => setProjects(projects)
    );
  };

  const updateProjects = (id: string) => {
    invoke<Project[]>("update_projects", {
      projects: projects.map((p) =>
        p.id === id ? { ...p, title: "new title" } : p
      ),
    }).then((projects) => setProjects(projects));
  };

  return (
    <div className="w-screen min-h-screen flex flex-col p-4 gap-2">
      <div className="flex flex-row items-center justify-between p-1">
        <span className="text-xl">Projects</span>
        <button className="btn btn-ghost" onClick={() => appWindow.close()}>
          <MdClose size={32} />
        </button>
      </div>
      <div className="flex flex-col gap-2 p-1">
        <button className="btn btn-ghost justify-start gap-2">
          <MdAddCircle size={24} />
          <span>New Project</span>
        </button>
        <div className="flex flex-col">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group cursor-pointer flex flex-row items-center justify-between px-1 py-2 hover:bg-base rounded"
            >
              <span className="">{project.title}</span>
              <div className="flex flex-row items-center gap-1">
                <button className="btn btn-ghost p-0 text-text hidden group-hover:flex">
                  <MdEdit size={20} />
                </button>
                <button className="btn btn-ghost p-0 text-text hidden group-hover:flex">
                  <MdDelete size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsWindow;
