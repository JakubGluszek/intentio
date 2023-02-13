# Intentio

It's a pomodoro timer desktop application.

## About

The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s.

The technique uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. These intervals are known as "pomodoros". The idea behind the technique is to use the time more efficiently, and to reduce the impact of interruptions on work.

The technique has been widely adopted by individuals and organizations alike, and has been shown to be an effective way to improve productivity and focus.

## Preview

![Preview](https://github.com/JakubGluszek/intentio/blob/master/.github/images/intentio-demo.gif)

## Features

- **projects** - categorize what you spend your time on.
- **queues** - define & queue up multiple sessions.
- **analytics** - view stats & monitor your progress.
- **settings** - configure timer, alerts & themes.

## Install

Download the latest version from the [releases](https://github.com/JakubGluszek/intentio/releases) page.

## Stack

Client Stack

- React (user interface library)
- TailwindCSS (css framework)
- Zustand (state manager)

Backend stack

- Tauri (constructs app itself)
- SurrealDB (local database)

## Development

Make sure to install all [dependencies](https://tauri.app/v1/guides/getting-started/prerequisites) needed for your system.

Other prerequisites include:
```bash
sudo apt install librust-alsa-sys-dev
sudo apt-get install libclang-dev
```

```bash
git clone https://github.com/JakubGluszek/intentio.git

cd intentio

npm install

npm run tauri dev
```

## Roadmap

- [x] Ability to take notes
- [x] Ability to define & finish tasks
- [ ] Option to export data into multiple formats
- [ ] More customizable user preferences, like windows behavior etc
- [x] Ability to run bash scripts on session events (start, pause, end) for both "focus" and "break"
- [ ] External server for synchronizing data between desktops

## Acknowledgments

- Credits
  - https://github.com/vydimitrov/react-countdown-circle-timer
  - https://github.com/vydimitrov/use-elapsed-time
- Inspirations
  - [Pomotroid](https://github.com/Splode/pomotroid)
  - [Pomofocus](https://pomofocus.io/)
- Alerts audio made by a friend called [BAD](https://www.youtube.com/channel/UCCqowyNy72D-TVhYJzNHhpw) on social media
