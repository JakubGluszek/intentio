import React from "react";

import config from "@/config";
import IntentioLogo from "@/components/IntentioLogo";

const AboutView: React.FC = () => {
  return (
    <div className="grow flex flex-col gap-3 pb-2 text-text/80">
      <div className="flex-1 text-primary">
        <IntentioLogo />
        <div className="text-center text-sm -translate-y-3 text-text/80">
          A pomodoro app for&nbsp;
          <span className="text-primary/80 font-bold">your</span> needs.
        </div>
      </div>
      <div className="flex flex-col gap-1.5 text-center text-xl">
        <div>
          <span>Version: </span>
          <span className="text-primary/80 font-bold">
            {config.about.version}
          </span>
        </div>
        <div>
          <span>Author: </span>
          <a
            className="text-primary/80 font-bold"
            tabIndex={-2}
            href={config.about.authorHomepage}
            target="_blank"
            rel="noreferrer"
          >
            {config.about.author}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
