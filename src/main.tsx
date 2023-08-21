import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "@/assets/root.css";

export function App() {
  const Lazy = React.lazy(() => import("@/pages/index"));
  return <Suspense children={<Lazy />} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
