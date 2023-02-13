/** Generic config for windows that are created via `WebviewWindow` */
const WebviewConfig = {
  decorations: false,
  skipTaskbar: true,
  resizable: false,
  fullscreen: false,
  alwaysOnTop: true,
  focus: true,
};

const config = {
  about: {
    version: "1.1.0",
    sourceCode: "https://github.com/JakubGluszek/intentio",
    homePage: "https://intentio.app",
  },
  webviews: {
    main: {
      width: 340,
      height: 380,
    },
    settings: {
      url: "/settings",
      title: "Settings",
      width: 480,
      height: 360,
      ...WebviewConfig,
    },
    intents: {
      url: "/intents",
      title: "Intents",
      width: 640,
      height: 480,
      maxWidth: 640,
      maxHeight: 480,
      ...WebviewConfig,
    },
  },
};

export default config;