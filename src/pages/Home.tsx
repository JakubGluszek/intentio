import React from "react";
import Timer from "../components/Timer";
import useSettings from "../hooks/useSettings";

const Home: React.FC = () => {
  const { settings } = useSettings();

  if (!settings) {
    return <div>loading</div>;
  }

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="m-auto w-[60vw] h-[60vh]">
        <Timer settings={settings} />
      </div>
    </div>
  );
};

export default Home;
