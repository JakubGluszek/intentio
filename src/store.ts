import create from "zustand";
import { Theme } from "./bindings/Theme";

interface State {
  currentTheme?: Theme;
  setCurrentTheme: (theme: Theme) => void;
}

const useGlobal = create<State>((set) => ({
  currentTheme: undefined,
  setCurrentTheme: (theme: Theme) =>
    set((state) => ({ ...state, currentTheme: theme })),
}));

export default useGlobal;
