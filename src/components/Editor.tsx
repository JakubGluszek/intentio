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
    <div ref={containerRef} className="grow window bg-window text-sm">
      <CodeMirror
        value={props.value}
        onChange={(value) => props.onChange(value)}
        extensions={[langs.markdown()]}
        height={`${height}px`}
        theme={makeCustomTheme(store.currentTheme!)}
        basicSetup={{ lineNumbers: false, foldGutter: false }}
        data-tauri-disable-drag
      />
    </div>
  );
};

const makeCustomTheme = (data: Theme) =>
  createTheme({
    theme: "light",
    settings: {
      background: data.window_hex,
      foreground: data.text_hex,
      caret: data.primary_hex,
      selection: "#036dd626",
      selectionMatch: "#036dd626",
      lineHighlight: "#8a91991a",
    },
    styles: [
      { tag: t.comment, color: Color(data.base_hex).lighten(0.6).hex() },
      { tag: t.variableName, color: data.primary_hex },
      { tag: t.keyword, color: Color(data.primary_hex).negate().hex() },
      { tag: t.typeName, color: Color(data.primary_hex).negate().hex() },
    ],
  });

export default Editor;
