import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";

import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { MantineProvider } from "@mantine/core";

const router = createBrowserRouter(
  createRoutesFromElements(<Route path="*" element={<App />} />)
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);
