import { MButton } from "../MaterialButton";
import style from "./index.module.css";

import { useState } from "react";

function Counter({ name }: { name?: string }) {
  const [count, setCount] = useState(0);

  return (
    <div className={style.container}>
      <p>
        Counter {name ?? "unknown"}: {count}
      </p>
      <MButton onPointerUp={() => setCount((c) => c + 1)}>+1</MButton>
    </div>
  );
}

export { Counter };
