# Sentio

A pomodoro timer desktop application.

![Preview](https://github.com/JakubGluszek/sentio/blob/master/.github/images/sentio-demo.gif)

The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s.

The technique uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. These intervals are known as "pomodoros."

The idea behind the technique is to use the time more efficiently, and to reduce the impact of interruptions on work.

The technique has been widely adopted by individuals and organizations alike, and has been shown to be an effective way to improve productivity and focus.

## Features

- **projects** - categorize what you spend your time on.
- **queues** - define & queue up multiple sessions.
- **analytics** - view stats & monitor your progress.
- **settings** - configure timer, alerts & themes.

## Install

Download the latest version from the [releases](https://github.com/JakubGluszek/sentio/releases) page.

## Stack

- Tauri
- React (with TypeScript)
- SurrealDB

## Development

Make sure to install all [prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites).

Another prerequisite on linux is "libasound2-dev":

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
- [ ] Fullscreen mode
- [ ] Ability to run bash scripts on certain events like: play, pause, break start/end etc...
- [ ] UI re-work

## Acknowledgments

- Inspirations
  - [Pomotroid](https://github.com/Splode/pomotroid)
  - [Pomofocus](https://pomofocus.io/)
- App's default alerts audio made by [BAD](https://www.youtube.com/channel/UCCqowyNy72D-TVhYJzNHhpw)
