import React from "react";
import { motion } from "framer-motion";
import { clsx } from "@mantine/core";

export interface CheckBoxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  width?: number;
  height?: number;
}

export const CheckBox: React.FC<CheckBoxProps> = (props) => {
  const { width = 48, height = 20, ...restProps } = props;

  const [init, setInit] = React.useState(true);

  React.useEffect(() => {
    setInit(false);
  }, []);

  return (
    <button
      className="group bg-base/20 rounded-sm shadow-inner shadow-black/30"
      style={{
        width,
        height
      }}
      onClick={() => restProps.onChange(!props.checked)}
      tabIndex={-3}
    >
      <div className="relative w-full h-full">
        <motion.div
          className={clsx(
            "rounded-sm",
            restProps.checked
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
