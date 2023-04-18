import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import Color from "color";

import useStore from "@/store";
import { Theme } from "@/bindings/Theme";

interface Props {
  value: string;
  lang: "shell" | "md";
  onChange: (code: string) => void;
}

const Editor: React.FC<Props> = (props) => {
  const [height, setHeight] = React.useState(0);

  const store = useStore();
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    containerRef.current && setHeight(containerRef.current.clientHeight);
  }, []);

  return (
    <div ref={containerRef} className="grow text-sm rounded-sm overflow-clip">
      <CodeMirror
        autoFocus
        value={props.value}
        onChange={(value) => props.onChange(value)}
        extensions={props.lang === "md" ? [langs.markdown()] : [langs.shell()]}
        height={`${height}px`}
        theme={makeCustomTheme(store.currentTheme!)}
        basicSetup={{ lineNumbers: false, foldGutter: false, autocompletion: false }}
        data-tauri-disable-drag
      />
    </div>
  );
};

const makeCustomTheme = (data: Theme) =>
  createTheme({
    theme: "dark",
    settings: {
      background: "rgb(0,0,0,0.2)",
      foreground: data.text_hex,
      caret: data.primary_hex,
      selection: "rgb(var(--primary-color) / 0.1)",
      selectionMatch: "rgb(var(--primary-color) / 0.3)",
      lineHighlight: "rgb(var(--base-color) / 0.05)",
    },
    styles: [
      { tag: t.comment, color: Color(data.base_hex).lighten(0.6).hex() },
      { tag: t.variableName, color: data.primary_hex },
      { tag: t.keyword, color: Color(data.primary_hex).negate().hex() },
      { tag: t.typeName, color: Color(data.primary_hex).negate().hex() },
    ],
  });

export default Editor;
