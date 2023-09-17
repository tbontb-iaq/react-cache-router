import style from "./index.module.css";
import pages from "./pages";

import { MButton } from "@/lib/components/MaterialButton";
import { RouterView, useNavigation } from "@/lib/router";

import _ from "lodash";
import { useEffect } from "react";

export default function Index() {
  const nav = useNavigation();
  const path = _.last(location.pathname.split("/"));

  useEffect(() => {
    if (location.pathname === "/") {
      console.log("replace path");
      nav.navTo(".//" + pages.find((p) => p.default)?.path, {
        method: "replace",
      });
    }
  }, [nav]);

  return (
    <div className={style.container}>
      <RouterView />
      <nav>
        {pages.map((p) => (
          <MButton
            className={p.path === path ? "active" : ""}
            key={p.name}
            onPointerUp={() => p.path !== path && nav.navTo(".//" + p.path)}
          >
            <span className="material-symbols-outlined">{p.icon}</span>
            <span>{p.name}</span>
          </MButton>
        ))}
      </nav>
    </div>
  );
}
