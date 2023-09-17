import style from "./index.module.css";

import { Counter } from "@/lib/components/Counter";

export default function Home() {
  return (
    <div className={style.container}>
      <p>Home Page</p>
      <Counter name="home" />
    </div>
  );
}
