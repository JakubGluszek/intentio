import React from "react";
import { MdDelete, MdSave } from "react-icons/md";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import { emit } from "@tauri-apps/api/event";
import { useClickOutside } from "@mantine/hooks";
import { ChromePicker } from "react-color";

import { ColorInput } from "@/components";
import { Theme } from "@/bindings/Theme";
import ipc from "@/ipc";
import useStore from "@/store";
import { useConfirmDelete } from "@/hooks";
import {
  Button,
  DangerButton,
  Input,
  ModalContainer,
  Pane,
  PaneHeading,
  Section,
  Tooltip,
  ScrollArea,
  SectionsWrapper,
} from "@/ui";

import { ColorType } from "..";
import { UpdateTheme } from "@/bindings/UpdateTheme";

interface EditThemeProps {
  data: Theme;
  onExit: () => void;
}

const EditTheme: React.FC<EditThemeProps> = (props) => {
  const [viewThemePreview, setViewThemePreview] = React.useState(false);
  const [viewColorPicker, setViewColorPicker] = React.useState<ColorType>();
  const [colorPickerHex, setColorPickerHex] = React.useState("#000000");

  const store = useStore();
  const { register, handleSubmit, setValue, getValues, watch } =
    useForm<UpdateTheme>();
  const { viewConfirmDelete, onDelete } = useConfirmDelete(() =>
    ipc.deleteTheme(props.data.id).then(() => {
      props.onExit();
      toast("Theme deleted");
    })
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
    setValue("label", props.data.label);
    setValue("window_hex", props.data.window_hex);
    setValue("base_hex", props.data.base_hex);
    setValue("primary_hex", props.data.primary_hex);
    setValue("text_hex", props.data.text_hex);
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
              <div>Edit theme</div>
              <div
                className="flex flex-row items-center"
                data-tauri-disable-drag
              >
                <Tooltip
                  label={viewConfirmDelete ? "Confirm" : "Delete"}
                  className="text-danger"
                >
                  <DangerButton variant="ghost" onClick={() => onDelete()}>
                    <MdDelete size={24} />
                  </DangerButton>
                </Tooltip>

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
                    {...register("label", { required: true, maxLength: 16 })}
                    id="color-scheme-name"
                    maxLength={16}
                    placeholder="Label"
                  />
                </div>
                <ColorInput
                  label="Window"
                  hex={watch("window_hex")!}
                  onViewColorPicker={() => {
                    setColorPickerHex(watch("window_hex")!);
                    setViewColorPicker("window");
                  }}
                />
                <ColorInput
                  label="Base"
                  hex={watch("base_hex")!}
                  onViewColorPicker={() => {
                    setColorPickerHex(watch("base_hex")!);
                    setViewColorPicker("base");
                  }}
                />
                <ColorInput
                  label="Primary"
                  hex={watch("primary_hex")!}
                  onViewColorPicker={() => {
                    setColorPickerHex(watch("primary_hex")!);
                    setViewColorPicker("primary");
                  }}
                />
                <ColorInput
                  label="Text"
                  hex={watch("text_hex")!}
                  onViewColorPicker={() => {
                    setColorPickerHex(watch("text_hex")!);
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

export default EditTheme;
