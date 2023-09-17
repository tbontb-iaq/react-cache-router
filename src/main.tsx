import "@/assets/root.css";
import { RouterProvider, createRouter } from "@/lib/router";

import React from "react";
import ReactDOM from "react-dom/client";

const router = createRouter({
  router: {
    index: { component: () => import("@/pages/index") },
    draft: { component: () => import("@/pages/draft") },
  },
});

export function App() {
  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
