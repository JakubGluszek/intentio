import React from "react";

import useStore from "@/store";
import ipc from "@/ipc";
import { CascadeSections, OverflowY } from "@/components";
import { Button, Pane, Section, Tooltip } from "@/ui";
import { ThemeState } from "@/types";
import { Theme } from "@/bindings/Theme";
import EditTheme from "./EditTheme";
import CreateTheme from "./CreateTheme";
import { SelectedTheme } from "./SelectedTheme";
import { ChangeTheme } from "./ChangeTheme";
import ThemeView from "./ThemeView";
import { MdAddCircle, MdLabelImportant } from "react-icons/md";
import { useEvents } from "@/hooks";

const ThemesView: React.FC = () => {
  const [editTheme, setEditTheme] = React.useState<Theme | null>(null);
  const [viewCreate, setViewCreate] = React.useState(false);
  const [viewChangeTheme, setViewChangeTheme] =
    React.useState<ThemeState | null>(null);

  const store = useStore();

  React.useEffect(() => {
    ipc.getThemes().then((data) => store.setThemes(data));
  }, []);

  useEvents({ theme_created: (data) => store.addTheme(data) });

  if (viewCreate) return <CreateTheme onExit={() => setViewCreate(false)} />;
  if (editTheme)
    return <EditTheme data={editTheme} onExit={() => setEditTheme(null)} />;
  if (viewChangeTheme)
    return (
      <ChangeTheme
        state={viewChangeTheme}
        onExit={() => setViewChangeTheme(null)}
        onSelected={(state, data) => {
          switch (state) {
            case "Idle":
              ipc.setIdleTheme(data);
              break;
            case "Focus":
              ipc.setFocusTheme(data);
              break;
            case "Break":
              ipc.setBreakTheme(data);
              break;
            case "Long Break":
              ipc.setLongBreakTheme(data);
              break;
          }
          setViewChangeTheme(null);
        }}
      />
    );

  if (store.themes.length === 0) return null;

  return (
    <Pane className="grow flex flex-col">
      <OverflowY>
        <CascadeSections>
          <Section heading="Selected themes">
            <div className="flex flex-col gap-1">
              <SelectedTheme
                state="Idle"
                data={store.getIdleTheme()!}
                onChangeTheme={(state) => setViewChangeTheme(state)}
              />
              <SelectedTheme
                state="Focus"
                data={store.getFocusTheme()!}
                onChangeTheme={(state) => setViewChangeTheme(state)}
              />
              <SelectedTheme
                state="Break"
                data={store.getBreakTheme()!}
                onChangeTheme={(state) => setViewChangeTheme(state)}
              />
              <SelectedTheme
                state="Long Break"
                data={store.getLongBreakTheme()!}
                onChangeTheme={(state) => setViewChangeTheme(state)}
              />
            </div>
          </Section>
          <Section
            heading={
              <div className="flex flex-row items-center justify-between">
                <div className="section-heading">
                  <MdLabelImportant size={24} />
                  <div>Collection</div>
                </div>
                <Tooltip label="Add theme">
                  <Button variant="ghost" onClick={() => setViewCreate(true)}>
                    <MdAddCircle size={24} />
                  </Button>
                </Tooltip>
              </div>
            }
          >
            {store.themes
              .sort((a, b) => (a.favorite ? 0 : 1) - (b.favorite ? 0 : 1))
              .sort((a, b) => (a.default ? 1 : 0) - (b.default ? 1 : 0))
              .map((theme) => (
                <ThemeView
                  key={theme.id}
                  data={theme}
                  onViewEdit={(theme) => setEditTheme(theme)}
                />
              ))}
          </Section>
        </CascadeSections>
      </OverflowY>
    </Pane>
  );
};

export default ThemesView;
