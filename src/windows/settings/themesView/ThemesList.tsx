import React from "react";

import { Theme } from "@/bindings/Theme";
import ThemeView from "./ThemeView";

interface Props {
  themes: Theme[];
  viewFavoriteOnly: boolean;
  onThemeViewEdit: (theme: Theme) => void;
  onThemeSelected: (theme: Theme) => void;
}

const ThemesList: React.FC<Props> = (props) => {
  let themes = props.themes;

  if (props.viewFavoriteOnly) {
    themes = props.themes.filter((theme) => !theme.favorite);
  }

  return (
    <div className="grow flex flex-col window bg-window overflow-y-auto">
      <div className="max-h-0 overflow-y">
        <div className="flex flex-col gap-1.5 p-2">
          {themes.map((theme) => (
            <ThemeView
              key={theme.id}
              data={theme}
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
