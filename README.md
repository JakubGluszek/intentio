# Pomodoro

A pomodoro desktop app aimed at improving performance.

## Todo now

- [x] Merge state struct with settings.
- [x] Remove fn play_audio() -> introduce seperate audio related functions that are callable without any arguments.
- [x] Enable modifying alert's repeat value.
- [x] Allow changing audio for alerts.
- [ ] Allow theming all timer states.
- [ ] Copy default audio files to $AUDIO directory

## Todos

- [ ] Settings.

  - [ ] Alert section.

    - [ ] Listen for audio directory events (new files, deleted files) or add a refresh button

  - [ ] Theme section.

    - [ ] Select themes for each timer state: idle, focus, break.

  - [ ] About section.

    - [ ] Load data dynamically.

- [ ] Alerts.
- [ ] Feedback window.
- [ ] Report a bug window.
- [ ] Projects window.
- [ ] Todo window.
- [ ] Fullscreen mode.
- [ ] Summarize window.

  View pomodoros which creation dates > now() - 24h

- [ ] Analytics window.
- [ ] Sessions.

  - [ ] Plan sessions for each day of the week.

- [ ] Storage Library

  This would reduce a lot of duplicate methods on structs (save(), read(), update()...)

  - [ ] Local
  - [ ] Cloud
  - [ ] Optimize pomodoros storage

    For example merge & split based on date.

- [ ] Dynamic task tray menu.

  - [ ] Start / Pause
  - [ ] Next

- [ ] Dynamic tray icon.

  - [ ] Seperate icons for seperate state: idle, focus, break.

- [ ] Website

  - [ ] Home Page

    - [ ] Dislay total stats
    - [ ] Display [today, week, month] scoreboard.
