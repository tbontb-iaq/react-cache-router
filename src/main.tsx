import { useCacheEffect, usePath } from "./lib/router/context/cache";

import "@/assets/root.css";
import { Counter } from "@/lib/components/counter";
import { RouterProvider } from "@/lib/router/components/router-provider";
import { createRouter } from "@/lib/router/utils/createRouter";

import React from "react";
import ReactDOM from "react-dom/client";

const router = createRouter({
  router: {
    index: {
      component: () => import("@/pages/index"),
      default: false,
      error: () =>
        import("@/lib/router/components/error").then((v) => ({
          default: v.RouteError,
        })),
      children: {
        c1: {
          component: function C1() {
            const path = usePath();

            useCacheEffect(() => {
              console.log("deactivate", path);
              // console.trace();
              return () => console.log("activate", path);
            });
            // throw new Error("test");

            return <Counter name="c1" />;
          },
        },
      },
    },
    draft: { component: () => import("@/pages/draft") },

    r1: {
      component: "r1",
      children: {
        "r2/r3/": {
          component: <div>r3 page</div>,
        },
      },
    },
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
