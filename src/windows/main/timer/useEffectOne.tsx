import React from "react";

const useEffectOnce = (effect: () => void | (() => void)) => {
  const destroyFunc = React.useRef<void | (() => void)>();
  const effectCalled = React.useRef(false);
  const renderAfterCalled = React.useRef(false);
  const [val, setVal] = React.useState<number>(0);

  if (effectCalled.current) {
    renderAfterCalled.current = true;
  }

  React.useEffect(() => {
    // only execute the effect first time around
    if (!effectCalled.current) {
      destroyFunc.current = effect();
      effectCalled.current = true;
    }

    // this forces one render after the effect is run
    setVal((val) => val + 1);

    return () => {
      // if the comp didn't render since the useEffect was called,
      // we know it's the dummy React cycle
      if (!renderAfterCalled.current) {
        return;
      }
      if (destroyFunc.current) {
        destroyFunc.current();
      }
    };
  }, []);
};

export default useEffectOnce;
