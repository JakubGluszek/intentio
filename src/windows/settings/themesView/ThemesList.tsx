import React from "react";

import { Theme } from "@/bindings/Theme";
import ThemeView from "./ThemeView";

interface Props {
  themes: Theme[];
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  viewFavoriteOnly: boolean;
  onThemeViewEdit: (theme: Theme) => void;
  onThemeViewConfig: (theme: Theme) => void;
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
        <div className="flex flex-col gap-1.5 p-2">
          {themes.map((theme) => {
            let isSelected = props.selectedIds.includes(theme.id);

            return (
              <ThemeView
                key={theme.id}
                data={theme}
                isSelected={isSelected}
                onViewEdit={() => props.onThemeViewEdit(theme)}
                onViewConfig={() => props.onThemeViewConfig(theme)}
                onMouseDown={(e) => {
                  if (!e.ctrlKey) {
                    props.setSelectedIds([]);
                    return;
                  }
                  if (isSelected) {
                    props.setSelectedIds((ids) =>
                      ids.filter((id) => id !== theme.id)
                    );
                  } else {
                    props.setSelectedIds((ids) => [theme.id, ...ids]);
                  }
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThemesList;
