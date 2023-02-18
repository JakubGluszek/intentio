import React from "react";
import { useForm } from "react-hook-form";
import { MdCircle } from "react-icons/md";
import { clsx, Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";

import ipc from "@/ipc";
import useStore from "@/store";
import utils from "@/utils";
import { useContextMenu } from "@/hooks";
import { Script } from "@/bindings/Script";
import { ScriptForUpdate } from "@/bindings/ScriptForUpdate";
import ScriptContextMenu from "./ScriptContextMenu";
import EditScriptCode from "./EditScriptCode";
import ScriptEventsView from "./ScriptEventsView";

interface ScriptView {
  data: Script;
}

const ScriptView: React.FC<ScriptView> = (props) => {
  const [viewCode, setViewCode] = React.useState(false);
  const [viewEvents, setViewEvents] = React.useState(false);

  const store = useStore();

  const handleUpdate = async (data: Partial<ScriptForUpdate>) =>
    await ipc
      .updateScript(props.data.id, data)
      .then((data) => store.patchScript(props.data.id, data));

  if (viewCode)
    return <EditScriptCode data={props.data} exit={() => setViewCode(false)} />;

  if (viewEvents)
    return (
      <ScriptEventsView
        data={props.data}
        onUpdate={handleUpdate}
        exit={() => setViewEvents(false)}
      />
    );

  return (
    <DefaultView
      data={props.data}
      viewCode={() => setViewCode(true)}
      viewEvents={() => setViewEvents(true)}
      onUpdate={handleUpdate}
    />
  );
};

interface DefaultViewProps {
  data: Script;
  viewCode: () => void;
  viewEvents: () => void;
  onUpdate: (data: Partial<ScriptForUpdate>) => void;
}

const DefaultView: React.FC<DefaultViewProps> = (props) => {
  const { viewMenu, setViewMenu, onContextMenuHandler } = useContextMenu();

  return (
    <div
      className="flex flex-col gap-1 card"
      onContextMenu={onContextMenuHandler}
    >
      <div className="w-full flex flex-row items-center gap-2">
        <Tooltip label={props.data.active ? "Active" : "Disabled"}>
          <button
            className={clsx(
              "pt-0.5",
              props.data.active ? "text-green-500" : "text-red-500"
            )}
            onClick={() => props.onUpdate({ active: !props.data.active })}
          >
            <MdCircle size={16} />
          </button>
        </Tooltip>

        <LabelView label={props.data.label} onUpdate={props.onUpdate} />
      </div>

      {viewMenu ? (
        <ScriptContextMenu
          data={props.data}
          leftPosition={viewMenu.leftPosition}
          topPosition={viewMenu.topPosition}
          hide={() => setViewMenu(undefined)}
          viewCode={() => props.viewCode()}
          viewEvents={() => props.viewEvents()}
          runScript={() => utils.executeScript(props.data.body)}
        />
      ) : null}
    </div>
  );
};

interface LabelViewProps {
  label: string;
  onUpdate: (data: Partial<ScriptForUpdate>) => void;
}

const LabelView: React.FC<LabelViewProps> = (props) => {
  const [viewEdit, setViewEdit] = React.useState(false);

  const { register, handleSubmit, setValue } =
    useForm<Partial<ScriptForUpdate>>();
  const ref = useClickOutside(() => setViewEdit(false));

  const onSubmit = handleSubmit((data) => {
    props.onUpdate(data);
    setViewEdit(false);
  });

  React.useEffect(() => {
    setValue("label", props.label);
  }, []);

  return viewEdit ? (
    <form className="w-full" onSubmit={onSubmit} ref={ref}>
      <input
        autoComplete="off"
        autoFocus
        tabIndex={-3}
        maxLength={24}
        onKeyDown={(e) => {
          if (e.key !== "Escape") return;
          setValue("label", props.label);
          setViewEdit(false);
        }}
        {...register("label", { required: true, minLength: 1, maxLength: 32 })}
      />
    </form>
  ) : (
    <div
      className="w-full text-text/80"
      data-tauri-disable-drag
      onDoubleClick={() => setViewEdit(true)}
    >
      {props.label}
    </div>
  );
};

export default ScriptView;
