/** Generic config for windows that are created via `WebviewWindow` */
export const WebviewConfig = {
  decorations: false,
  skipTaskbar: true,
  resizable: false,
  fullscreen: false,
  alwaysOnTop: true,
  transparent: true,
  focus: true,
};

const config = {
  about: {
    version: "2.0.0",
    sourceCode: "https://github.com/JakubGluszek/intentio",
    homePage: "https://intentio.app",
    discordServer: "https://discord.gg/xyjGRmCuuS",
    author: "Jakub Głuszek",
    authorHomepage: "https://jacobgluszek.dev",
  },
  windows: {
    main: {
      width: 300,
      height: 340,
    },
    settings: {
      url: "/settings",
      title: "Settings",
      width: 300,
      height: 410,
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
    analytics: {
      url: "/analytics",
      title: "Analytics",
      width: 420,
      height: 320,
      maxWidth: 600,
      maxHeight: 380,
      ...WebviewConfig,
    },
  },
};

export default config;
