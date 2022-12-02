import React from "react";
import { MdAddCircle, MdClose } from "react-icons/md";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toast } from "react-hot-toast";

import { Project } from "../../bindings/Project";
import { ipc_invoke } from "../../app/ipc";
import useGlobal from "../../app/store";
import Button from "../../components/Button";
import Layout from "../../components/Layout";
import ProjectView from "./ProjectView";

const ProjectsWindow: React.FC = () => {
  const projects = useGlobal((state) => state.projects);
  const setProjects = useGlobal((state) => state.setProjects);
  const currentProject = useGlobal((state) => state.currentProject);

  const [viewCreate, setViewCreate] = React.useState(false);

  const nameRef = React.useRef<HTMLInputElement | null>(null);
  const [containerRef] = useAutoAnimate<HTMLDivElement>();

  const createProject = (name: string) => {
    if (projects.find((p) => p.name.toLowerCase() === name.toLowerCase())) {
      nameRef.current?.focus();
      return;
    }
    ipc_invoke<Project>("create_project", {
      data: { name },
    })
      .then(() => {
        toast("Project created");
        setViewCreate(false);
      })
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    ipc_invoke<Project[]>("get_projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Layout label="Projects">
      <div className="flex flex-col gap-4 p-1">
        {viewCreate ? (
          <div className="flex flex-row items-center gap-2">
            <input
              autoFocus
              className="input"
              autoComplete="off"
              placeholder="Name"
              type="text"
              onKeyUp={(e) =>
                e.key === "Enter" && createProject(e.currentTarget.value)
              }
              minLength={1}
              maxLength={24}
            />
            <Button transparent onClick={() => setViewCreate(false)}>
              <MdClose size={24} />
            </Button>
          </div>
        ) : null}
        {!viewCreate ? (
          <Button onClick={() => setViewCreate(true)}>
            <MdAddCircle size={24} />
            <span>Add a project</span>
          </Button>
        ) : null}
        <div ref={containerRef} className="flex flex-col gap-2">
          {projects.map((project) => (
            <ProjectView
              key={project.id}
              data={project}
              selected={currentProject?.id === project.id}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectsWindow;
