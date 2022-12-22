import React from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { emit } from "@tauri-apps/api/event";
import { useForm, UseFormWatch } from "react-hook-form";

import { Theme } from "@/bindings/Theme";
import Button from "@/components/Button";
import ThemeFormInputs from "./ThemeFormInputs";
import { useStore } from "@/app/store";
import services from "@/app/services";
import { ThemeForUpdate } from "@/bindings/ThemeForUpdate";

interface ThemeViewProps {
  theme: Theme;
}

const ThemeView: React.FC<ThemeViewProps> = ({ theme }) => {
  const [viewEdit, setViewEdit] = React.useState(false);
  const [viewDelete, setViewDelete] = React.useState(false);

  const currentTheme = useStore((state) => state.currentTheme);
  const removeTheme = useStore((state) => state.removeTheme);
  const patchTheme = useStore((state) => state.patchTheme);

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const { register, handleSubmit, setValue, watch } = useForm<ThemeForUpdate>();

  // update theme
  const onSubmit = handleSubmit((data) => {
    services.updateTheme(theme.id, data).then((data) => {
      if (theme.id === currentTheme?.id) {
        emit("update_current_theme", theme);
      }
      patchTheme(data.id, data);
      setViewEdit(false);
    });
  });

  const deleteTheme = async (id: string) => {
    await services.deleteTheme(id).then((data) => {
      removeTheme(data.id);
      setViewDelete(false);
    });
  };

  const disabled =
    watch("name") === theme.name &&
    watch("window_hex") === theme.window_hex &&
    watch("base_hex") === theme.base_hex &&
    watch("primary_hex") === theme.primary_hex &&
    watch("text_hex") === theme.text_hex;

  // Scroll container into view when edit mode is on
  React.useEffect(() => {
    viewEdit &&
      containerRef.current &&
      containerRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
  }, [viewEdit]);

  // Fill out form with current theme values
  React.useEffect(() => {
    setValue("name", theme.name);
    setValue("window_hex", theme.window_hex);
    setValue("base_hex", theme.base_hex);
    setValue("primary_hex", theme.primary_hex);
    setValue("text_hex", theme.text_hex);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ color: watch("text_hex") }}
      className="group flex flex-col rounded overflow-clip"
    >
      <div
        style={{
          border: watch("base_hex"),
        }}
        className="relative h-10 flex flex-row items-center rounded border-2"
      >
        {/* Area to set theme as the current theme */}
        <button
          style={{ backgroundColor: watch("primary_hex") }}
          className={`min-w-[48px] h-full cursor-pointer transition-transform duration-200`}
          onClick={() => services.setCurrentTheme(theme.id)}
        ></button>

        {/* Heading */}
        <div
          style={{
            backgroundColor: watch("window_hex"),
          }}
          className="w-full h-full flex flex-row items-center justify-between px-2"
        >
          <span style={{ color: watch("text_hex") }}>{watch("name")}</span>
          {!theme.default && (
            <div className="hidden group-hover:flex">
              <Button
                transparent
                style={{ color: watch("primary_hex") }}
                onClick={() => setViewEdit(!viewEdit)}
              >
                {viewEdit ? (
                  <MdArrowDropUp size={32} />
                ) : (
                  <MdArrowDropDown size={32} />
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Current theme indicator */}
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
          {/* Delete theme modal */}
          {viewDelete && (
            <DeleteModal
              watch={watch}
              cancel={() => setViewDelete(false)}
              deleteTheme={() => deleteTheme(theme.id)}
            />
          )}
          {/* Update theme form */}
          <form className="flex flex-col gap-6 p-4 text-sm" onSubmit={onSubmit}>
            <div className="flex flex-col gap-4">
              <ThemeFormInputs register={register} watch={watch} />
            </div>
            {/* Form actions */}
            <div className="flex flex-row items-center justify-between">
              <Button
                type="button"
                transparent
                style={{ color: watch("primary_hex") }}
                onClick={() => setViewDelete(true)}
              >
                Delete
              </Button>
              <Button
                disabled={disabled}
                type="submit"
                style={{
                  backgroundColor: watch("primary_hex"),
                  color: watch("window_hex"),
                }}
              >
                Update
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

interface DeleteModalProps {
  watch: UseFormWatch<Partial<Theme>>;
  cancel: () => void;
  deleteTheme: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  watch,
  cancel,
  deleteTheme,
}) => {
  return (
    <>
      {/* Modal background */}
      <div
        style={{ backgroundColor: watch("window_hex") }}
        className="z-10 absolute w-full h-full opacity-60"
      ></div>
      {/* Modal window */}
      <div className="z-20 absolute w-full h-full flex flex-col items-center justify-center p-8">
        <div
          style={{ backgroundColor: watch("base_hex") }}
          className="p-4 flex flex-col items-center gap-4 rounded shadow-lg text-sm"
        >
          <span className="text-center">
            Are you sure you want to delete "{watch("name")}"?
          </span>
          <div className="w-full flex flex-row items-center justify-between">
            <Button
              transparent
              style={{ color: watch("primary_hex") }}
              onClick={() => cancel()}
            >
              Cancel
            </Button>
            <Button
              style={{
                backgroundColor: watch("primary_hex"),
                color: watch("window_hex"),
              }}
              onClick={() => deleteTheme()}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemeView;
