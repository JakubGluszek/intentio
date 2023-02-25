import React from "react";
import { ChromePicker } from "react-color";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { emit } from "@tauri-apps/api/event";
import { Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";

import ipc from "@/ipc";
import useStore from "@/store";
import { Button, ModalContainer } from "@/components";
import { Theme } from "@/bindings/Theme";
import { ThemeForCreate } from "@/bindings/ThemeForCreate";
import { ColorType } from "..";

interface Props {
  hide: () => void;
  display: boolean;
  theme: Theme;
}

const CreateThemeModal: React.FC<Props> = (props) => {
  const [viewThemePreview, setViewThemePreview] = React.useState(false);
  const [viewColorPicker, setViewColorPicker] = React.useState<ColorType>();
  const [colorPickerHex, setColorPickerHex] = React.useState("#000000");

  const { register, handleSubmit, setValue, watch, getValues } =
    useForm<ThemeForCreate>();

  const store = useStore();
  const ref = useClickOutside(() => {
    if (!viewColorPicker) props.hide();

    switch (viewColorPicker) {
      case "window":
        setValue("window_hex", colorPickerHex);
        break;
      case "base":
        setValue("base_hex", colorPickerHex);
        break;
      case "primary":
        setValue("primary_hex", colorPickerHex);
        break;
      case "text":
        setValue("text_hex", colorPickerHex);
        break;
    }

    setViewColorPicker(undefined);
  });

  const onSubmit = handleSubmit(async (data) => {
    await ipc.createTheme(data).then((data) => {
      store.addTheme(data);
      props.hide();
      toast("Theme created");
    });
  });

  React.useEffect(() => {
    setValue("name", props.theme.name);
    setValue("window_hex", props.theme.window_hex);
    setValue("base_hex", props.theme.base_hex);
    setValue("primary_hex", props.theme.primary_hex);
    setValue("text_hex", props.theme.text_hex);
  }, []);

  return (
    <ModalContainer
      display={props.display}
      hide={!viewColorPicker ? props.hide : () => setViewColorPicker(undefined)}
    >
      <div ref={ref} className="flex flex-col gap-4 text-sm font-semibold">
        {viewColorPicker ? (
          <div data-tauri-disable-drag>
            <ChromePicker
              color={colorPickerHex}
              onChange={(data) => setColorPickerHex(data.hex)}
              disableAlpha
            />
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-4">
                <label className="min-w-[64px]" htmlFor="color-scheme-name">
                  Name
                </label>
                <input
                  {...register("name", { required: true, maxLength: 16 })}
                  id="color-scheme-name"
                  autoComplete="off"
                  className="input border-base/60"
                  type="text"
                  tabIndex={-2}
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
                  className="input border-base/60"
                  type="text"
                  tabIndex={-2}
                />
                <div
                  data-tauri-disable-drag
                  onClick={() => {
                    setColorPickerHex(watch("window_hex"));
                    setViewColorPicker("window");
                  }}
                  style={{ backgroundColor: watch("window_hex") }}
                  className="min-w-[40px] h-8 shadow-lg rounded cursor-pointer"
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
                  className="input border-base/60"
                  type="text"
                  tabIndex={-2}
                />
                <div
                  data-tauri-disable-drag
                  onClick={() => {
                    setColorPickerHex(watch("base_hex"));
                    setViewColorPicker("base");
                  }}
                  style={{ backgroundColor: watch("base_hex") }}
                  className="min-w-[40px] h-8 shadow-lg rounded cursor-pointer"
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
                  className="input border-base/60"
                  type="text"
                  tabIndex={-2}
                />
                <div
                  data-tauri-disable-drag
                  onClick={() => {
                    setColorPickerHex(watch("primary_hex"));
                    setViewColorPicker("primary");
                  }}
                  style={{ backgroundColor: watch("primary_hex") }}
                  className="min-w-[40px] h-8 shadow-lg rounded cursor-pointer"
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
                  className="input border-base/60"
                  tabIndex={-2}
                  type="text"
                />
                <div
                  data-tauri-disable-drag
                  onClick={() => {
                    setColorPickerHex(watch("text_hex"));
                    setViewColorPicker("text");
                  }}
                  style={{ backgroundColor: watch("text_hex") }}
                  className="min-w-[40px] h-8 shadow-lg rounded cursor-pointer"
                ></div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className=""></div>

              <div className="flex flex-row items-center gap-4">
                <Tooltip withArrow position="left" label="Preview">
                  <div
                    className="text-text/80"
                    onMouseOver={() => {
                      emit("preview_theme", getValues());
                      setViewThemePreview(true);
                    }}
                    onMouseLeave={() => {
                      emit("preview_theme", props.theme);
                      setViewThemePreview(false);
                    }}
                  >
                    {viewThemePreview ? (
                      <RiEyeFill size={24} />
                    ) : (
                      <RiEyeCloseFill size={24} />
                    )}
                  </div>
                </Tooltip>
                <Button type="submit" style={{ width: "fit-content" }}>
                  Create
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </ModalContainer>
  );
};

export default CreateThemeModal;
