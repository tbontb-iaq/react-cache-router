import style from "./index.module.css";

import { Counter } from "@/lib/components/Counter";

export default function Hot() {
  return (
    <div className={style.container}>
      <p>Hot Page</p>
      <Counter name="hot" />
    </div>
  );
}
