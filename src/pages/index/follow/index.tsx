import style from "./index.module.css";

import { Counter } from "@/lib/components/Counter";

export default function Follow() {
  return (
    <div className={style.container}>
      <p>Follow Page</p>
      <Counter name="follow" />
    </div>
  );
}
