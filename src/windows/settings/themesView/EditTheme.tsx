import React from "react";
import { MdArrowBack, MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import { emit } from "@tauri-apps/api/event";

import { ColorInput, ModalContainer } from "@/components";
import { Theme } from "@/bindings/Theme";
import ipc from "@/ipc";
import useStore from "@/store";
import { ThemeForCreate } from "@/bindings/ThemeForCreate";
import { ColorType } from "..";
import { useClickOutside } from "@mantine/hooks";
import { ChromePicker } from "react-color";
import { useConfirmDelete } from "@/hooks";
import { Button, Input } from "@/ui";

interface Props {
  data: Theme;
  onExit: () => void;
}

const EditTheme: React.FC<Props> = (props) => {
  const [viewThemePreview, setViewThemePreview] = React.useState(false);
  const [viewColorPicker, setViewColorPicker] = React.useState<ColorType>();
  const [colorPickerHex, setColorPickerHex] = React.useState("#000000");

  const store = useStore();
  const { register, handleSubmit, setValue, getValues, watch } =
    useForm<ThemeForCreate>();
  const { viewConfirmDelete, onDelete } = useConfirmDelete(() =>
    ipc.deleteTheme(props.data.id).then(() => props.onExit())
  );

  const modalRef = useClickOutside(() => {
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

  // update theme
  const onSubmit = handleSubmit((data) => {
    ipc.updateTheme(props.data.id, data).then(() => {
      toast("Theme updated");
      props.onExit();
    });
  });

  React.useEffect(() => {
    setValue("name", props.data.name);
    setValue("window_hex", props.data.window_hex);
    setValue("base_hex", props.data.base_hex);
    setValue("primary_hex", props.data.primary_hex);
    setValue("text_hex", props.data.text_hex);
  }, []);

  return (
    <div className="grow flex flex-col gap-0.5">
      <div className="h-fit flex flex-row gap-0.5">
        <div className="window bg-window">
          <Button onClick={() => props.onExit()} variant="ghost">
            <MdArrowBack size={24} />
          </Button>
        </div>
        <div className="grow window bg-window flex flex-row items-center px-2">
          Edit theme
        </div>
      </div>

      <div className="grow flex flex-col window bg-window p-1.5">
        <ModalContainer
          display={!!viewColorPicker}
          hide={() => setViewColorPicker(undefined)}
        >
          <div ref={modalRef} data-tauri-disable-drag>
            <ChromePicker
              color={colorPickerHex}
              onChange={(data) => setColorPickerHex(data.hex)}
              disableAlpha
            />
          </div>
        </ModalContainer>

        <form
          onSubmit={onSubmit}
          className="grow flex flex-col justify-between"
        >
          <div className="flex flex-row items-center gap-2">
            <label
              className="min-w-[64px] text-text/80"
              htmlFor="color-scheme-name"
            >
              Name
            </label>
            <Input
              {...register("name", { required: true, maxLength: 16 })}
              id="color-scheme-name"
            />
          </div>

          <ColorInput
            label="Window"
            type="window_hex"
            watch={watch}
            register={register}
            onViewColorPicker={() => {
              setColorPickerHex(watch("window_hex"));
              setViewColorPicker("window");
            }}
          />
          <ColorInput
            label="Base"
            type="base_hex"
            watch={watch}
            register={register}
            onViewColorPicker={() => {
              setColorPickerHex(watch("base_hex"));
              setViewColorPicker("base");
            }}
          />
          <ColorInput
            label="Primary"
            type="primary_hex"
            watch={watch}
            register={register}
            onViewColorPicker={() => {
              setColorPickerHex(watch("primary_hex"));
              setViewColorPicker("primary");
            }}
          />
          <ColorInput
            label="Text"
            type="text_hex"
            watch={watch}
            register={register}
            onViewColorPicker={() => {
              setColorPickerHex(watch("text_hex"));
              setViewColorPicker("text");
            }}
          />

          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              {!props.data.default && (
                <Button onClick={() => onDelete()} variant="ghost">
                  <MdDelete size={24} />
                  {viewConfirmDelete && <div>Confirm</div>}
                </Button>
              )}
              {!viewConfirmDelete && (
                <div
                  className="flex flex-row items-center text-primary/80"
                  onMouseOver={() => {
                    emit("preview_theme", getValues());
                    setViewThemePreview(true);
                  }}
                  onMouseLeave={() => {
                    emit("preview_theme", store.currentTheme);
                    setViewThemePreview(false);
                  }}
                >
                  {viewThemePreview ? (
                    <RiEyeFill size={24} />
                  ) : (
                    <RiEyeCloseFill size={24} />
                  )}
                </div>
              )}
            </div>
            <Button variant="base" type="submit">
              Update theme
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTheme;
