import React from "react";

import { Pane, PaneHeading, Section } from "@/ui";
import { ThemeState } from "@/types";
import { CascadeSections, OverflowY } from "@/components";
import useStore from "@/store";
import { Theme } from "@/bindings/Theme";
import ThemeView from "./ThemeView";

interface ChangeThemeProps {
  state: ThemeState;
  onSelected: (state: ThemeState, theme: Theme) => void;
  onExit: () => void;
}

export const ChangeTheme: React.FC<ChangeThemeProps> = (props) => {
  const store = useStore();

  return (
    <Pane className="grow flex flex-col gap-1">
      <PaneHeading body={props.state} onExit={props.onExit} />
      <OverflowY>
        <CascadeSections>
          <Section>
            <div className="flex flex-col gap-1">
              {store.themes
                .sort((a, b) => (a.favorite ? 0 : 1) - (b.favorite ? 0 : 1))
                .sort((a, b) => (a.default ? 1 : 0) - (b.default ? 1 : 0))
                .map((theme) => (
                  <ThemeView
                    key={theme.id}
                    data={theme}
                    onSelected={(theme) => props.onSelected(props.state, theme)}
                    isSelectable
                  />
                ))}
            </div>
          </Section>
        </CascadeSections>
      </OverflowY>
    </Pane>
  );
};
