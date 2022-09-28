import React from "react";
import useSettings from "../hooks/useSettings";
import { SettingsUpdate } from "../types";

const SettingsWindow: React.FC = () => {
  const { settings, update } = useSettings();
  const [changes, setChanges] = React.useState<SettingsUpdate>({});

  if (!settings) {
    return <div>loading</div>;
  }

  return (
    <div className="w-screen h-screen flex flex-col p-4">
      {Object.keys(changes).length > 0 && (
        <button
          className="btn"
          onClick={() => update(changes).then(() => setChanges({}))}
        >
          save
        </button>
      )}
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-row items-center gap-4">
          <span>Pomodoro duration</span>
          <input
            type="number"
            defaultValue={settings.pomodoro_duration}
            onChange={(e) =>
              setChanges({
                ...changes,
                pomodoro_duration: parseInt(e.currentTarget.value),
              })
            }
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <span>Break duration</span>
          <input
            type="number"
            defaultValue={settings.break_duration}
            onChange={(e) =>
              setChanges({
                ...changes,
                break_duration: parseInt(e.currentTarget.value),
              })
            }
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <span>Long break duration</span>
          <input
            type="number"
            defaultValue={settings.long_break_duration}
            onChange={(e) =>
              setChanges({
                ...changes,
                long_break_duration: parseInt(e.currentTarget.value),
              })
            }
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <span>Long break interval</span>
          <input
            type="number"
            defaultValue={settings.long_break_interval}
            onChange={(e) =>
              setChanges({
                ...changes,
                long_break_interval: parseInt(e.currentTarget.value),
              })
            }
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <span>Auto start pomodoros</span>
          <input
            type="checkbox"
            defaultChecked={settings.auto_start_pomodoros}
            onChange={(e) =>
              setChanges({
                ...changes,
                auto_start_pomodoros: e.currentTarget.checked,
              })
            }
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <span>Auto start breaks</span>
          <input
            type="checkbox"
            defaultChecked={settings.auto_start_breaks}
            onChange={(e) =>
              setChanges({
                ...changes,
                auto_start_breaks: e.currentTarget.checked,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsWindow;
