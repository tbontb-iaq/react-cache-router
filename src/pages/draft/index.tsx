import style from "./index.module.css";

import { Link } from "@/lib/router/components/link";
import { useCacheEffect, usePath } from "@/lib/router/context/cache";

import { useState } from "react";

export default function Draft() {
  const [count, setCount] = useState(0);

  const path = usePath();

  useCacheEffect(() => {
    console.log("deactivate", path);
    // console.trace();
    return () => console.log("activate", path);
  });

  return (
    <div className={style.container}>
      <p>Draft Page</p>
      <p>count: {count}</p>
      <button onPointerUp={() => setCount(count + 1)}>+1</button>
      <Link to="./index/c1">index/c1</Link>
    </div>
  );
}
