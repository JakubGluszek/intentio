import React from "react";
import { HTMLMotionProps, motion } from "framer-motion";

import utils from "@/utils";
import { WindowContext } from "@/contexts";

// TODO: receive: width, height, press duration...
interface TaskButtonProps extends HTMLMotionProps<"button"> {
  completed: boolean;
  onValueChange: () => void;
}

export const TaskButton: React.FC<TaskButtonProps> = (props) => {
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [animate, setAnimate] = React.useState(false);
  const [completed, setCompleted] = React.useState(props.completed);

  const { onValueChange, completed: _, ...restProps } = props;

  const requestRef = React.useRef<number | null>(null);
  const previousTimeRef = React.useRef<number | null>(null);
  const elapsedTimeRef = React.useRef(0);
  const completedRef = React.useRef(props.completed);
  completedRef.current = props.completed;
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const { windowScale } = React.useContext(WindowContext)!;

  const size = windowScale.iconSize;
  const padding = 8;

  const cleanup = () => {
    requestRef.current && cancelAnimationFrame(requestRef.current);
    previousTimeRef.current = null;
    elapsedTimeRef.current = 0;
    setElapsedTime(0);
    setAnimate(false);
    setIsMouseDown(false);
  };

  React.useEffect(() => {
    if (!isMouseDown) {
      cleanup();
      return;
    }

    setAnimate(true);

    const loop = (time: number) => {
      const timeSec = time / 1000;

      if (previousTimeRef.current === null) {
        previousTimeRef.current = timeSec;
        requestRef.current = requestAnimationFrame(loop);
        return;
      }

      // get current elapsed time
      const deltaTime = timeSec - previousTimeRef.current;
      let currentElapsedTime = elapsedTimeRef.current + deltaTime;
      // update refs with the current elapsed time
      previousTimeRef.current = timeSec;
      elapsedTimeRef.current = currentElapsedTime;
      setElapsedTime(currentElapsedTime);

      if (currentElapsedTime >= 0.5) {
        setCompleted((prev) => !prev);
        timeoutRef.current = setTimeout(() => onValueChange(), 100);
        cleanup();
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      cleanup();
    };
  }, [isMouseDown]);

  React.useEffect(() => {
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, []);

  React.useEffect(() => {
    setCompleted(props.completed);
  }, [props.completed]);

  const tickProgress = utils.scale(elapsedTime, 0, 0.5, 0, 1);

  return (
    <motion.button
      className="group m-1 border-2 border-primary/80 hover:border-primary active:border-primary overflow-clip transition-colors flex flex-col items-center justify-center"
      layout
      style={{
        minWidth: size,
        width: size,
        minHeight: size,
        height: size,
      }}
      whileTap={{ scale: animate ? 0.9 : 1 }}
      tabIndex={-3}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => {
        setIsMouseDown(false);
        cleanup();
      }}
      onMouseLeave={() => setIsMouseDown(false)}
      {...restProps}
    >
      <motion.div
        className="bg-primary/80 group-hover:bg-primary group-active:bg-primary transition-colors"
        style={{
          width: size - padding,
          height: size - padding,
        }}
        animate={{
          opacity: completed ? 1 - tickProgress : tickProgress,
        }}
      ></motion.div>
    </motion.button>
  );
};
