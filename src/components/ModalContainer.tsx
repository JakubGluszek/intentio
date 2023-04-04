import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  children: ReactNode;
  display: boolean;
  hide?: () => void;
}

const ModalContainer: React.FC<Props> = (props) => {
  React.useEffect(() => {
    const handleOnKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.hide && props.hide();
    };

    document.addEventListener("keydown", handleOnKeyDown);
    return () => document.removeEventListener("keydown", handleOnKeyDown);
  }, [props.hide]);

  return createPortal(
    <AnimatePresence>
      {props.display && (
        <div className="z-[1337420] fixed top-0 left-0 w-screen h-screen flex flex-col">
          <motion.div
            className="fixed top-0 left-0 w-screen h-screen bg-black p-8"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.6,
              transition: { duration: 0.2 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.2 },
            }}
          ></motion.div>
          <motion.div
            className="m-auto card bg-window hover:bg-window shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1.0,
              opacity: 1.0,
              transition: { duration: 0.2 },
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
              transition: { duration: 0.2 },
            }}
          >
            {props.children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.getElementById("root")!
  );
};

export default ModalContainer;
