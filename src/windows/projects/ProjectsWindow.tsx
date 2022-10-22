import React from "react";
import { appWindow } from "@tauri-apps/api/window";
import { MdAddCircle, MdClose, MdDelete, MdEdit } from "react-icons/md";

import Layout from "../../components/Layout";
import { Project } from "../../bindings/Project";

const ProjectsWindow: React.FC = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);

  const createProject = () => {};

  const updateProjects = (id: string) => {};

  return (
    <Layout>
      <div className="w-screen min-h-screen flex flex-col p-4 gap-2">
        <div className="flex flex-row items-center justify-between p-1">
          <span className="text-lg">Projects</span>
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
                <span className="">{project.name}</span>
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
    </Layout>
  );
};

export default ProjectsWindow;
