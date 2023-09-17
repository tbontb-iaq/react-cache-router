import style from "./index.module.css";

import { Counter } from "@/lib/components/Counter";
import { MButton } from "@/lib/components/MaterialButton";

import { useCallback } from "react";

export default function Draft() {
  const onPointerUp = useCallback<
    React.PointerEventHandler<HTMLButtonElement>
  >(() => {
    console.log("click");
  }, []);

  return (
    <div className={style.container}>
      <p>Draft Page</p>
      <MButton onPointerUp={onPointerUp}>
        <div style={{ padding: "40px 80px" }}>
          <p>click me</p>
        </div>
      </MButton>
      <Counter name="draft" />
    </div>
  );
}
