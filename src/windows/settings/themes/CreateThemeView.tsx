import React from "react";
import { useForm } from "react-hook-form";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import { emit } from "@tauri-apps/api/event";

import Button from "@/components/Button";
import { Theme } from "@/bindings/Theme";
import { toast } from "react-hot-toast";
import { useStore } from "@/app/store";
import services from "@/app/services";
import { ThemeForCreate } from "@/bindings/ThemeForCreate";

interface Props {
  hide: () => void;
  theme: Theme;
}

const CreateThemeView: React.FC<Props> = ({ theme, hide }) => {
  const [viewThemePreview, setViewThemePreview] = React.useState(false);
  const { register, handleSubmit, setValue, watch, getValues } =
    useForm<ThemeForCreate>();

  const containerRef = React.useRef<HTMLFormElement | null>(null);

  const store = useStore();

  const onSubmit = handleSubmit(async (data) => {
    await services.createTheme(data).then((data) => {
      store.addTheme(data);
      hide();
      toast("Theme created");
    });
  });

  React.useEffect(() => {
    containerRef.current &&
      containerRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
  }, []);

  React.useEffect(() => {
    setValue("name", theme.name);
    setValue("window_hex", theme.window_hex);
    setValue("base_hex", theme.base_hex);
    setValue("primary_hex", theme.primary_hex);
    setValue("text_hex", theme.text_hex);
  }, []);

  return (
    <form
      ref={containerRef}
      className="flex flex-col gap-6 p-2 text-sm animate-in duration-200 fade-in zoom-in-90 bg-base rounded"
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-4 bg-window rounded p-4">
        <div className="flex flex-row items-center gap-4">
          <label className="min-w-[64px]" htmlFor="color-scheme-name">
            Name
          </label>
          <input
            {...register("name", { required: true, maxLength: 16 })}
            id="color-scheme-name"
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
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
      <div className="flex flex-row items-center justify-between">
        <Button transparent onClick={() => hide()}>
          Cancel
        </Button>
        <div
          className="p-2"
          onMouseOver={() => {
            emit("preview_theme", getValues());
            setViewThemePreview(true);
          }}
          onMouseLeave={() => {
            emit("preview_theme", theme);
            setViewThemePreview(false);
          }}
        >
          {viewThemePreview ? (
            <RiEyeFill size={24} />
          ) : (
            <RiEyeCloseFill size={24} />
          )}
        </div>
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
};

export default CreateThemeView;
