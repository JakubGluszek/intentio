export interface Settings {
  pomodoro_duration: number;
  break_duration: number;
  is_long_break: boolean;
  long_break_duration: number;
  long_break_interval: number;
  auto_start_pomodoros: boolean;
  auto_start_breaks: boolean;
}

export interface SettingsUpdate {
  pomodoro_duration?: number;
  break_duration?: number;
  is_long_break?: boolean;
  long_break_duration?: number;
  long_break_interval?: number;
  auto_start_pomodoros?: boolean;
  auto_start_breaks?: boolean;
}
