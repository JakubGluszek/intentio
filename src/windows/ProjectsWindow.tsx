import { invoke } from "@tauri-apps/api/tauri";
import React from "react";
import { Project } from "../types";

const ProjectsWindow: React.FC = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);

  React.useEffect(() => {
    invoke<Project[]>("read_projects").then((projects) =>
      setProjects(projects)
    );
  }, []);

  const createProject = () => {
    invoke<Project[]>("save_project", { title: "new project" }).then(
      (projects) => setProjects(projects)
    );
  };

  const updateProject = (id: string) => {
    invoke<Project[]>("update_projects", {
      projects: projects.map((p) =>
        p.id === id ? { ...p, title: "new title" } : p
      ),
    }).then((projects) => setProjects(projects));
  };

  return <div></div>;
};

export default ProjectsWindow;
