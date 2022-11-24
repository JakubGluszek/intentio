import React from "react";
import cuid from "cuid";
import { MdAddCircle } from "react-icons/md";
import { WebviewWindow } from "@tauri-apps/api/window";
import { Select, Slider } from "@mantine/core";

import { QueueSession } from "../../bindings/QueueSession";
import useGlobal from "../../store";
import { WebviewConfig } from "../../config";
import Button from "../../components/Button";

interface Props {
  hide: () => void;
  save: (session: QueueSession) => void;
}

const CreateSessionView: React.FC<Props> = ({ hide, save }) => {
  const [duration, setDuration] = React.useState(25);
  const [cycles, setCycles] = React.useState(1);
  const [projectId, setProjectId] = React.useState<string | null>(null);

  const projects = useGlobal((state) => state.projects);

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    containerRef.current?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col gap-2 bg-window rounded p-4"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-4">
            <label className="min-w-[80px]" htmlFor="session-duration">
              Duration
            </label>
            <Slider
              classNames={{
                root: "w-full",
                bar: "bg-primary",
                thumb: "bg-primary border-primary",
                track: "before:bg-base",
                label: "bg-base text-text",
              }}
              min={1}
              max={90}
              defaultValue={duration}
              onChangeEnd={(minutes) => setDuration(minutes)}
            />
          </div>
          <div className="flex flex-row items-center gap-4">
            <label className="min-w-[80px]">Project</label>
            {/* value, label */}
            <Select
              value={projectId}
              onChange={setProjectId}
              searchable
              clearable
              data={projects.map((p) => ({ value: p.id, label: p.name }))}
              dropdownPosition="bottom"
              minLength={1}
              maxLength={16}
              classNames={{
                input:
                  "bg-window border-2 border-base focus:border-primary text-text focus:text-primary",
                dropdown:
                  "bg-window border-2 border-primary flex flex-col gap-2",
                item: "bg-window text-text",
                itemsWrapper: "flex flex-col gap-1",
              }}
              styles={{
                item: {
                  "&[data-selected]": {
                    "&, &:hover": {
                      backgroundColor: "var(--primary-color)",
                      color: "var(--window-color)",
                    },
                  },
                  "&[data-hovered]": {
                    backgroundColor: "var(--base-color)",
                    color: "var(--text-color)",
                  },
                },
              }}
            />
            <Button
              transparent
              onClick={() =>
                new WebviewWindow("projects", {
                  url: "/projects",
                  title: "Projects",
                  width: 280,
                  height: 360,
                  ...WebviewConfig,
                })
              }
            >
              <MdAddCircle size={32} />
            </Button>
          </div>
          <div className="flex flex-row items-center gap-4">
            <label className="min-w-[80px]" htmlFor="session-cycles">
              Cycles
            </label>
            <Slider
              classNames={{
                root: "w-full",
                bar: "bg-primary",
                thumb: "bg-primary border-primary",
                track: "before:bg-base",
                label: "bg-base text-text",
              }}
              min={1}
              max={16}
              defaultValue={cycles}
              onChangeEnd={(cycles) => setCycles(cycles)}
            />
          </div>
        </div>
        {/* Controls */}
        <div className="flex flex-row items-center justify-between">
          <Button transparent onClick={() => hide()}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() =>
              save({ id: cuid(), duration, cycles, project_id: projectId })
            }
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateSessionView;
