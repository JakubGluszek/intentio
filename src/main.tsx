import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { invoke } from "@tauri-apps/api";

import App from "./App";
import "./style.css";
import { Theme } from "./bindings/Theme";
import { applyTheme } from "./utils";

const router = createBrowserRouter(
  createRoutesFromElements(<Route path="*" element={<App />} />)
);

const theme = await invoke<Theme>("get_current_theme");
applyTheme(theme);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);
