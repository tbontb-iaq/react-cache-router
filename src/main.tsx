import "@/assets/root.css";
import { RouterProvider, createRouter } from "@/lib/router";
import indexPages from "@/pages/index/pages";

import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

const router = createRouter({
  router: {
    "": {
      component: () => import("@/pages/index"),
      children: Object.fromEntries(indexPages.map((p) => [p.path, p])),
    },
    draft: { component: () => import("@/pages/draft") },
  },
});

export function App() {
  useEffect(() => {
    console.log(import.meta.glob("@/pages/**/*.*"));
  }, []);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
