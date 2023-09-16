import style from "./index.module.css";

import { Link } from "@/lib/router/components/link";
import { RouterView } from "@/lib/router/components/router-view";
import { useCacheEffect, usePath } from "@/lib/router/context/cache";

import { pathToRegexp } from "path-to-regexp";

export default function Index() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  (window as any).pathToRegexp = pathToRegexp;

  const path = usePath();

  useCacheEffect(() => {
    console.log("deactivate", path);
    // console.trace();
    return () => console.log("activate", path);
  });

  return (
    <div className={style.container}>
      <p>Index Page</p>
      <Link to="./draft">draft</Link>
      <Link to="./index/unknown">unknown</Link>
      <RouterView />
    </div>
  );
}
