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
      language="shell"
      placeholder="Enter your bash code here"
      onChange={(evn) => props.onChange(evn.target.value)}
      padding={8}
      className="bg-darker/20 rounded"
      style={{
        fontSize: 12,
        fontFamily:
          "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
      }}
    />
  );
};

export default Editor;
