import React from "react";
import {
  MdAddCircle,
  MdArrowDropDown,
  MdArrowDropUp,
  MdColorLens,
} from "react-icons/md";
import { BiShow } from "react-icons/bi";
import { emit } from "@tauri-apps/api/event";
import { useForm } from "react-hook-form";

import { Settings } from "../../bindings/Settings";
import { Theme } from "../../bindings/Theme";
import { DeleteData, ipc_invoke } from "../../ipc";
import { applyTheme } from "../../utils";
import useGlobal from "../../store";

const ThemeSection: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);

  const themes = useGlobal((state) => state.themes);
  const setThemes = useGlobal((state) => state.setThemes);

  const currentTheme = useGlobal((state) => state.currentTheme);

  React.useEffect(() => {
    ipc_invoke<Theme[]>("get_themes").then((res) => setThemes(res.data));

    return;
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-center gap-2">
        <MdColorLens size={28} />
        <span className="text-lg">Themes</span>
      </div>
      <div className="flex flex-col gap-4">
        {!viewCreate && (
          <button
            className="btn btn-ghost justify-start"
            onMouseUp={() => setViewCreate(true)}
          >
            <MdAddCircle size={24} />
            <span>Add a theme</span>
          </button>
        )}
        {viewCreate && currentTheme && (
          <CreateThemeView
            theme={currentTheme}
            hide={() => setViewCreate(false)}
          />
        )}
        <div className="flex flex-col gap-2">
          {themes &&
            themes.map((theme) => <ThemeView key={theme.id} theme={theme} />)}
        </div>
      </div>
    </div>
  );
};

interface ThemeViewProps {
  theme: Theme;
}

const ThemeView: React.FC<ThemeViewProps> = ({ theme }) => {
  const [viewEdit, setViewEdit] = React.useState(false);
  const [viewDelete, setViewDelete] = React.useState(false);

  const currentTheme = useGlobal((state) => state.currentTheme);
  const removeTheme = useGlobal((state) => state.removeTheme);

  const { register, handleSubmit, setValue, watch } = useForm<FormData>();

  React.useEffect(() => {
    setValue("name", theme.name);
    setValue("window_hex", theme.window_hex);
    setValue("base_hex", theme.base_hex);
    setValue("primary_hex", theme.primary_hex);
    setValue("text_hex", theme.text_hex);
  }, []);

  // update theme
  const onSubmit = handleSubmit((data) => {
    ipc_invoke<Theme>("update_theme", {
      id: theme.id,
      data: { ...data, default: false },
    }).then((res) => {
      res.data.id === currentTheme?.id &&
        emit("update_current_theme", res.data);
    });
  });

  const deleteTheme = async () => {
    const res = await ipc_invoke<DeleteData>("delete_theme", { id: theme.id });
    removeTheme(res.data.id);

    // if the deleted theme was currently used, set a new current theme
    if (res.data.id === currentTheme?.id) {
      ipc_invoke<Settings>("update_settings", {
        data: { current_theme_id: "theme:abyss" },
      }).then(() =>
        ipc_invoke<Theme>("get_current_theme").then((res) =>
          emit("update_current_theme", res.data)
        )
      );
    }

    setViewDelete(false);
  };

  const setCurrentTheme = () => {
    ipc_invoke<Settings>("update_settings", {
      data: { current_theme_id: theme.id },
    }).then(() => emit("update_current_theme", theme));
  };

  const disabled =
    watch("name") === theme.name &&
    watch("window_hex") === theme.window_hex &&
    watch("base_hex") === theme.base_hex &&
    watch("primary_hex") === theme.primary_hex &&
    watch("text_hex") === theme.text_hex;

  return (
    <div
      style={{ color: watch("text_hex") }}
      className="flex flex-col rounded overflow-clip"
    >
      {/* Header */}
      <div
        style={{
          border: watch("base_hex"),
        }}
        className={`group relative h-10 flex flex-row items-center rounded border-2`}
      >
        <div
          style={{ backgroundColor: watch("primary_hex") }}
          className={`min-w-[48px] h-full cursor-pointer transition-transform duration-200`}
          onMouseUp={() => setCurrentTheme()}
        ></div>

        <div
          style={{
            backgroundColor: watch("window_hex"),
          }}
          className="group w-full h-full flex flex-row items-center justify-between px-2"
        >
          <span style={{ color: watch("text_hex") }}>{watch("name")}</span>
          {!theme.default && (
            <button
              style={{ color: watch("primary_hex") }}
              className="hidden group-hover:flex"
              onMouseUp={() => setViewEdit(!viewEdit)}
            >
              {viewEdit ? (
                <MdArrowDropUp size={32} />
              ) : (
                <MdArrowDropDown size={32} />
              )}
            </button>
          )}
        </div>

        {theme.id === currentTheme?.id && (
          <div
            style={{ backgroundColor: watch("primary_hex") }}
            className="w-full h-1 absolute bottom-0"
          ></div>
        )}
      </div>

      {/* Edit Section */}
      {viewEdit && (
        <div
          style={{
            backgroundColor: watch("window_hex"),
          }}
          className="relative flex flex-col"
        >
          {viewDelete && (
            <>
              <div
                style={{ backgroundColor: watch("window_hex") }}
                className="z-10 absolute w-full h-full opacity-60"
              ></div>
              <div className="z-20 absolute w-full h-full flex flex-col items-center justify-center p-8">
                <div
                  style={{ backgroundColor: watch("base_hex") }}
                  className="p-4 flex flex-col items-center gap-4 rounded shadow-lg text-sm"
                >
                  <span className="text-center">
                    Are you sure you want to delete "{watch("name")}"?
                  </span>
                  <div className="w-full flex flex-row items-center justify-between">
                    <button
                      style={{ color: watch("primary_hex") }}
                      className="btn btn-ghost"
                      onMouseUp={() => setViewDelete(false)}
                    >
                      Cancel
                    </button>
                    <button
                      style={{
                        backgroundColor: watch("primary_hex"),
                        color: watch("window_hex"),
                      }}
                      className="btn btn-primary"
                      onMouseUp={() => deleteTheme()}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          <form className="flex flex-col gap-6 p-4 text-sm" onSubmit={onSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-4">
                <label className="min-w-[64px]" htmlFor="color-scheme-name">
                  Name
                </label>
                <input
                  {...register("name", { required: true, maxLength: 16 })}
                  id="color-scheme-name"
                  className="input"
                  style={{ borderColor: watch("base_hex") }}
                  type="text"
                />
              </div>
              <div className="flex flex-row items-center gap-4">
                <label className="min-w-[64px]" htmlFor="window-hex">
                  Window
                </label>
                <input
                  {...register("window_hex", {
                    required: true,
                    pattern: /^#([0-9a-f]{3}){1,2}$/i,
                  })}
                  id="window-hex"
                  style={{ borderColor: watch("base_hex") }}
                  className="input"
                  type="text"
                />
                <div
                  style={{ backgroundColor: watch("window_hex") }}
                  className="min-w-[40px] h-8 shadow-lg rounded"
                ></div>
              </div>
              <div className="flex flex-row items-center gap-4">
                <label className="min-w-[64px]" htmlFor="base-hex">
                  Base
                </label>
                <input
                  {...register("base_hex", {
                    required: true,
                    pattern: /^#([0-9a-f]{3}){1,2}$/i,
                  })}
                  id="base-hex"
                  style={{ borderColor: watch("base_hex") }}
                  className="input"
                  type="text"
                />
                <div
                  style={{ backgroundColor: watch("base_hex") }}
                  className="min-w-[40px] h-8 shadow-lg rounded"
                ></div>
              </div>
              <div className="flex flex-row items-center gap-4">
                <label className="min-w-[64px]" htmlFor="primary-hex">
                  Primary
                </label>
                <input
                  {...register("primary_hex", {
                    required: true,
                    pattern: /^#([0-9a-f]{3}){1,2}$/i,
                  })}
                  id="primary-hex"
                  style={{ borderColor: watch("base_hex") }}
                  className="input"
                  type="text"
                />
                <div
                  style={{ backgroundColor: watch("primary_hex") }}
                  className="min-w-[40px] h-8 shadow-lg rounded"
                ></div>
              </div>
              <div className="flex flex-row items-center gap-4">
                <label className="min-w-[64px]" htmlFor="text-hex">
                  Text
                </label>
                <input
                  {...register("text_hex", {
                    required: true,
                    pattern: /^#([0-9a-f]{3}){1,2}$/i,
                  })}
                  id="text-hex"
                  style={{ borderColor: watch("base_hex") }}
                  className="input"
                  type="text"
                />
                <div
                  style={{ backgroundColor: watch("text_hex") }}
                  className="min-w-[40px] h-8 shadow-lg rounded"
                ></div>
              </div>
            </div>
            {/* Controls */}
            <div className="flex flex-row items-center justify-between">
              <button
                className="btn btn-ghost"
                style={{ color: watch("primary_hex") }}
                onMouseUp={() => setViewDelete(true)}
              >
                Delete
              </button>
              <button
                disabled={disabled}
                type="submit"
                className={`btn btn-primary ${disabled && "opacity-60"}`}
                style={{
                  backgroundColor: watch("primary_hex"),
                  color: watch("window_hex"),
                }}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

interface CreateThemeViewProps {
  hide: () => void;
  theme: Theme;
}

type FormData = {
  name: string;
  window_hex: string;
  base_hex: string;
  primary_hex: string;
  text_hex: string;
};

const CreateThemeView: React.FC<CreateThemeViewProps> = ({ theme, hide }) => {
  const { register, handleSubmit, setValue, watch, getValues } =
    useForm<FormData>();

  const addTheme = useGlobal((state) => state.addTheme);

  React.useEffect(() => {
    setValue("name", theme.name);
    setValue("window_hex", theme.window_hex);
    setValue("base_hex", theme.base_hex);
    setValue("primary_hex", theme.primary_hex);
    setValue("text_hex", theme.text_hex);
  }, []);

  const onSubmit = handleSubmit((data) => {
    ipc_invoke<Theme>("create_theme", {
      data: { ...data, default: false },
    }).then((res) => {
      addTheme(res.data);
      hide();
    });
  });

  return (
    <form className="flex flex-col gap-6 p-4 text-sm" onSubmit={onSubmit}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-4">
          <label className="min-w-[64px]" htmlFor="color-scheme-name">
            Name
          </label>
          <input
            {...register("name", { required: true, maxLength: 16 })}
            id="color-scheme-name"
            className="input"
            type="text"
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <label className="min-w-[64px]" htmlFor="window-hex">
            Window
          </label>
          <input
            {...register("window_hex", {
              required: true,
              pattern: /^#([0-9a-f]{3}){1,2}$/i,
            })}
            id="window-hex"
            className="input"
            type="text"
          />
          <div
            style={{ backgroundColor: watch("window_hex") }}
            className="min-w-[40px] h-8 shadow-lg rounded"
          ></div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <label className="min-w-[64px]" htmlFor="base-hex">
            Base
          </label>
          <input
            {...register("base_hex", {
              required: true,
              pattern: /^#([0-9a-f]{3}){1,2}$/i,
            })}
            id="base-hex"
            className="input"
            type="text"
          />
          <div
            style={{ backgroundColor: watch("base_hex") }}
            className="min-w-[40px] h-8 shadow-lg rounded"
          ></div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <label className="min-w-[64px]" htmlFor="primary-hex">
            Primary
          </label>
          <input
            {...register("primary_hex", {
              required: true,
              pattern: /^#([0-9a-f]{3}){1,2}$/i,
            })}
            id="primary-hex"
            className="input"
            type="text"
          />
          <div
            style={{ backgroundColor: watch("primary_hex") }}
            className="min-w-[40px] h-8 shadow-lg rounded"
          ></div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <label className="min-w-[64px]" htmlFor="text-hex">
            Text
          </label>
          <input
            {...register("text_hex", {
              required: true,
              pattern: /^#([0-9a-f]{3}){1,2}$/i,
            })}
            id="text-hex"
            className="input"
            type="text"
          />
          <div
            style={{ backgroundColor: watch("text_hex") }}
            className="min-w-[40px] h-8 shadow-lg rounded"
          ></div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <button className="btn btn-ghost" onMouseUp={() => hide()}>
          Cancel
        </button>
        <BiShow
          size={24}
          onMouseOver={() => applyTheme(getValues() as Theme)}
          onMouseLeave={() => applyTheme(theme)}
        />
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
};

export default ThemeSection;
