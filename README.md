# Sentio

A pomodoro timer desktop app.

<div align="center">
  <img alt="Sentio" src="https://github.com/JakubGluszek/sentio/blob/master/.github/images/sentio-preview.png" />
</div>

## Features

- **projects** - categorize what you spend your time on.
- **queues** - define & queue up multiple sessions.
- **analytics** - view stats & monitor your progress.
- **settings** - configure timer, alerts & themes.

## Install

Download the latest version from the [releases](https://github.com/JakubGluszek/sentio/releases) page.

## Development

Make sure to install all [prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites).

Another prerequisite on linux is to install "libasound2-dev":

`sudo apt install libasound2-dev`

```bash
git clone https://github.com/JakubGluszek/sentio.git

cd sentio

npm install

npm run tauri dev
```

## Roadmap

- [ ] Cloud synchronization
- [ ] Summaries
- [ ] Color pickers for theme creation
- [ ] Option to export data into multiple formats
- [ ] More user preferences
  - [ ] Minimize behavior (to tray or taskbar)

## Acknowledgments

- Inspirations
  - [Pomotroid](https://github.com/Splode/pomotroid)
  - [Pomofocus](https://pomofocus.io/)
- App's default alerts audio made by [BAD](https://www.youtube.com/channel/UCCqowyNy72D-TVhYJzNHhpw)
