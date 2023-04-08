import React from "react";

import { Theme } from "@/bindings/Theme";
import ThemeView from "./ThemeView";

interface Props {
  themes: Theme[];
  selectable: boolean;
  viewFavoriteOnly: boolean;
  onThemeViewEdit: (theme: Theme) => void;
  onThemeSelected: (theme: Theme) => void;
}

const ThemesList: React.FC<Props> = (props) => {
  let themes = props.themes;

  if (props.viewFavoriteOnly) {
    themes = props.themes.filter((theme) => theme.favorite);
  }

  themes = themes.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));

  return (
    <div className="grow flex flex-col window bg-window overflow-y-auto">
      <div className="max-h-0 overflow-y">
        <div className="flex flex-col gap-1.5 p-1.5">
          {themes.map((theme) => (
            <ThemeView
              key={theme.id}
              data={theme}
              selectable={props.selectable}
              onViewEdit={() => props.onThemeViewEdit(theme)}
              onSelected={() => props.onThemeSelected(theme)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemesList;