import React from "react";
import { enable, isEnabled, disable } from "tauri-plugin-autostart-api";
import { toast } from "react-hot-toast";

import {
  Card,
  CheckBox,
  Pane,
  Section,
  SectionsWrapper,
  ScrollArea,
} from "@/ui";
import ipc from "@/ipc";
import useStore from "@/store";

const GeneralPane: React.FC = () => {
  const [isAutoStart, setIsAutoStart] = React.useState<boolean>();

  const store = useStore();

  React.useEffect(() => {
    isEnabled().then((value) => setIsAutoStart(value));
  }, []);

  if (!store.settingsConfig || isAutoStart === undefined) return null;

  return (
    <Pane className="grow flex flex-col text-sm">
      <ScrollArea>
        <SectionsWrapper>
          <Section heading="App">
            <Card className="flex flex-row items-center justify-between">
              <div className="text-text/90 group-hover:text-text">
                Open on startup
              </div>
              <CheckBox
                checked={isAutoStart}
                onChange={(autoStart) =>
                  autoStart
                    ? enable().then(() => setIsAutoStart(true))
                    : disable().then(() => setIsAutoStart(false))
                }
              />
            </Card>

            <Card>
              <div className="flex flex-row items-center justify-between">
                <div className="text-text/90 group-hover:text-text">
                  System notifications
                </div>
                <CheckBox
                  checked={store.settingsConfig.system_notifications}
                  onChange={(system_notifications) =>
                    ipc.updateSettingsConfig({ system_notifications })
                  }
                />
              </div>
            </Card>
          </Section>

          <Section heading="Main Window">
            <Card>
              <div className="flex flex-row items-center justify-between">
                <div className="text-text/90 group-hover:text-text">
                  Always on top
                </div>
                <CheckBox
                  checked={store.settingsConfig.main_always_on_top}
                  onChange={(main_always_on_top) =>
                    ipc.updateSettingsConfig({ main_always_on_top }).then(() =>
                      toast("Restart app to apply change", {
                        duration: 2000,
                      })
                    )
                  }
                />
              </div>
            </Card>
            <Card>
              <div className="flex flex-row items-center justify-between">
                <div className="text-text/90 group-hover:text-text">
                  Minimize to tray
                </div>
                <CheckBox
                  checked={store.settingsConfig.main_minimize_to_tray}
                  onChange={(main_minimize_to_tray) =>
                    ipc.updateSettingsConfig({ main_minimize_to_tray })
                  }
                />
              </div>
            </Card>
            <Card>
              <div className="flex flex-row items-center justify-between">
                <div className="text-text/90 group-hover:text-text">
                  Display on timer complete
                </div>
                <CheckBox
                  checked={store.settingsConfig.main_display_on_timer_complete}
                  onChange={(main_display_on_timer_complete) =>
                    ipc.updateSettingsConfig({ main_display_on_timer_complete })
                  }
                />
              </div>
            </Card>
          </Section>
        </SectionsWrapper>
      </ScrollArea>
    </Pane>
  );
};

export default GeneralPane;
