import React from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { ChromePicker } from "react-color";
import { emit } from "@tauri-apps/api/event";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import { MdSave } from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";

import { ColorInput } from "@/components";
import useStore from "@/store";
import ipc from "@/ipc";
import {
  Button,
  Input,
  ModalContainer,
  Pane,
  PaneHeading,
  Section,
  Tooltip,
  ScrollArea,
  SectionsWrapper,
} from "@/ui";
import { ThemeForCreate } from "@/bindings/ThemeForCreate";

import { ColorType } from "..";

interface CreateThemeProps {
  onExit: () => void;
}

const CreateTheme: React.FC<CreateThemeProps> = (props) => {
  const [viewThemePreview, setViewThemePreview] = React.useState(false);
  const [viewColorPicker, setViewColorPicker] = React.useState<ColorType>();
  const [colorPickerHex, setColorPickerHex] = React.useState("#000000");

  const { register, handleSubmit, setValue, watch, getValues } =
    useForm<ThemeForCreate>();
  const store = useStore();
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

  const onSubmit = handleSubmit(async (data) => {
    await ipc.createTheme(data).then(() => {
      props.onExit();
      toast("Theme created");
    });
  });

  React.useEffect(() => {
    setValue("name", "");
    setValue("window_hex", store.currentTheme!.window_hex);
    setValue("base_hex", store.currentTheme!.base_hex);
    setValue("primary_hex", store.currentTheme!.primary_hex);
    setValue("text_hex", store.currentTheme!.text_hex);
  }, []);

  return (
    <React.Fragment>
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

      <Pane className="grow flex flex-col gap-1">
        <PaneHeading
          body={
            <div className="flex flex-row items-center justify-between">
              <div>Create theme</div>
              <div
                className="flex flex-row items-center gap-1"
                data-tauri-disable-drag
              >
                <Tooltip label="Save">
                  <Button variant="ghost" onClick={() => onSubmit()}>
                    <MdSave size={24} />
                  </Button>
                </Tooltip>

                <Tooltip label="Preview">
                  <Button
                    variant="ghost"
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
                  </Button>
                </Tooltip>
              </div>
            </div>
          }
          onExit={props.onExit}
        />
        <ScrollArea>
          <SectionsWrapper>
            <Section>
              <form onSubmit={onSubmit} className="grow flex flex-col gap-1.5">
                <div className="flex flex-row items-center gap-2">
                  <Input
                    {...register("name", { required: true, maxLength: 16 })}
                    id="color-scheme-name"
                    maxLength={16}
                    placeholder="Name"
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
              </form>
            </Section>
          </SectionsWrapper>
        </ScrollArea>
      </Pane>
    </React.Fragment>
  );
};

export default CreateTheme;