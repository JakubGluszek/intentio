import React from "react";
import { enable, isEnabled, disable } from "tauri-plugin-autostart-api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import { Card, CheckBox, Pane, Section } from "@/ui";
import ipc from "@/ipc";
import useStore from "@/store";

const GeneralView: React.FC = () => {
  const [isAutoStart, setIsAutoStart] = React.useState<boolean>();

  const store = useStore();

  React.useEffect(() => {
    isEnabled().then((value) => setIsAutoStart(value));
  }, []);

  if (!store.settingsConfig || isAutoStart === undefined) return null;

  return (
    <Pane className="grow flex flex-col" padding="lg">
      <div className="grow flex flex-col overflow-y-auto">
        <div className="max-h-0 overflow-y">
          <motion.div
            className="flex flex-col gap-2"
            variants={{
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  when: "beforeChildren",
                },
              },
              hidden: {
                opacity: 0,
              },
            }}
            initial="hidden"
            animate="visible"
          >
            <Section heading="App">
              <Card
                className="flex flex-row items-center justify-between"
              >
                <div className="text-text/90 group-hover:text-text">
                  Auto run on start-up
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
            </Section>

            <Section heading="Alerts">
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
              <Card className="flex flex-col gap-1">
                <div className="flex flex-row items-center justify-between">
                  <div className="text-text/90 group-hover:text-text">
                    Always on top
                  </div>
                  <CheckBox
                    checked={store.settingsConfig.main_always_on_top}
                    onChange={(main_always_on_top) =>
                      ipc
                        .updateSettingsConfig({ main_always_on_top })
                        .then(() =>
                          toast("Restart app to apply change", {
                            duration: 2000,
                          })
                        )
                    }
                  />
                </div>
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
            </Section>
          </motion.div>
        </div>
      </div>
    </Pane>
  );
};

export default GeneralView;
