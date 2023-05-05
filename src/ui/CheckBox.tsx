import React from "react";
import { motion } from "framer-motion";
import { clsx } from "@mantine/core";

export interface CheckBoxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export const CheckBox: React.FC<CheckBoxProps> = (props) => {
  const [init, setInit] = React.useState(true);

  const width = 64;

  React.useEffect(() => {
    setInit(false);
  }, []);

  return (
    <button
      className="group bg-base/20 rounded-sm shadow-inner shadow-black/30"
      style={{
        width: width,
        height: 20,
      }}
      onClick={() => props.onChange(!props.checked)}
      tabIndex={-3}
    >
      <div className="relative w-full h-full">
        <motion.div
          className={clsx(
            "rounded-sm",
            props.checked
              ? "bg-primary/80 group-hover:bg-primary shadow shadow-black/60"
              : "bg-base/80 group-hover:bg-base"
          )}
          style={{ position: "absolute", width: width / 2, height: "100%" }}
          transition={{ duration: init ? 0.6 : 0.15, delay: init ? 0.3 : 0 }}
          initial={{ opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            left: props.checked ? width / 2 : 0,
          }}
        ></motion.div>
      </div>
    </button>
  );
};
