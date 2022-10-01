export interface State {
  theme: Theme;
}

export interface Settings {
  pomodoro_duration: number;
  break_duration: number;
  long_break_duration: number;
  long_break_interval: number;
  auto_start_pomodoros: boolean;
  auto_start_breaks: boolean;
  alert: AlertSettings;
}

export interface AlertSettings {
  sound: string;
  volume: number;
  repeat: number;
}

export interface Pomodoro {
  id: string;
  duration: number;
  started_at: Date;
  finished_at: Date;
}

export interface Project {
  id: string;
  title: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: Colors;
}

export interface Colors {
  window: string;
  base: string;
  primary: string;
  text: string;
}
