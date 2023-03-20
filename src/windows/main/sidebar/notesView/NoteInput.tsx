import React from "react";
import { Textarea } from "@mantine/core";

interface NoteInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onEscape?: () => void;
  onSubmit?: () => void;
}

const NoteInput: React.FC<NoteInputProps> = (props) => {
  return (
    <Textarea
      autoComplete="off"
      className="grow flex flex-col"
      classNames={{
        input:
          "grow bg-window/90 border-2 border-primary/40 focus:border-primary/80 text-text p-1",
        wrapper: "grow flex flex-col",
      }}
      value={props.value}
      onChange={(e) => {
        props.onChange(e.currentTarget.value);
        e.currentTarget.scrollIntoView({ block: "center" });
      }}
      onBlur={() => {
        props.onBlur && props.onBlur();
      }}
      autoFocus
      minLength={1}
      maxLength={2048}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          props.onEscape && props.onEscape();
        } else if (e.ctrlKey && e.key === "Enter") {
          props.onSubmit && props.onSubmit();
        }
      }}
    ></Textarea>
  );
};

export default NoteInput;
