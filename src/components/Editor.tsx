import React from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import Color from "color";

import useStore from "@/store";

interface Props {
  value: string;
  onChange: (code: string) => void;
}

const Editor: React.FC<Props> = (props) => {
  const store = useStore();
  const ref = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    ref.current?.parentElement?.style.setProperty(
      "background-color",
      "rgba(0, 0, 0, 0.2)",
      "important"
    );
  }, []);

  return (
    <CodeEditor
      data-color-mode={
        Color(store.currentTheme?.window_hex).isDark() ? "dark" : "light"
      }
      ref={ref}
      value={props.value}
      autoComplete="off"
      language="shell"
      onChange={(evn) => props.onChange(evn.target.value)}
      padding={8}
      placeholder="Enter your script here"
      className="grow bg-darker/20 rounded-sm border-2 border-primary/20 focus-within:border-primary/40"
      style={{
        fontSize: 14,
        fontFamily:
          "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
      }}
    />
  );
};

export default Editor;
