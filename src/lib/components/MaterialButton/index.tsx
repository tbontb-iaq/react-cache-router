import "./index.css";

import { useRefInit } from "@/lib/hooks/ref-init";
import { useRerender } from "@/lib/hooks/rerender";
import * as random from "@/lib/utils/random";

import React, { useCallback, useRef } from "react";

type MButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

interface Ripple {
  x: number;
  y: number;
  size: number;
  end?: boolean;
}

const InitSize = 1;

// 也许应该改为使用 DOM 操作实现

function MaterialButton(props: MButtonProps) {
  const isHolding = useRef(false);
  const shouldRemove = useRef<string[]>([]);
  const buttonContainer = useRef<HTMLButtonElement>(null);
  const rippleMap = useRefInit(() => new Map<string, Ripple>());
  const rerender = useRerender();

  const pointerLeave = useCallback(() => {
    isHolding.current = false;
    shouldRemove.current
      .splice(0)
      .forEach((k) => (rippleMap.current.get(k)!.end = true));
    rerender();
  }, [rerender, rippleMap]);

  const onAnimationEnd = useCallback<
    React.AnimationEventHandler<HTMLDivElement>
  >(
    (ev) => {
      const el = ev.currentTarget,
        key = el.dataset.key;
      if (!key) return;
      if (rippleMap.current.get(key)?.end ?? false) {
        rippleMap.current.delete(key);
        rerender();
      } else if (!isHolding.current) {
        rippleMap.current.get(key)!.end = true;
        rerender();
      } else shouldRemove.current.push(key);
    },
    [rerender, rippleMap],
  );

  const onPointerLeave = useCallback<
    React.PointerEventHandler<HTMLButtonElement>
  >(
    (ev) => {
      props.onPointerLeave?.(ev);
      pointerLeave();
    },
    [pointerLeave, props],
  );

  const onPointerUp = useCallback<React.PointerEventHandler<HTMLButtonElement>>(
    (ev) => {
      props.onPointerUp?.(ev);
      pointerLeave();
    },
    [pointerLeave, props],
  );

  const onPointerDown = useCallback<
    React.PointerEventHandler<HTMLButtonElement>
  >(
    (ev) => {
      props.onPointerDown?.(ev);
      isHolding.current = true;
      if (buttonContainer.current === null) return;

      const { left, top, bottom, right } =
          buttonContainer.current.getBoundingClientRect(),
        { clientX, clientY } = ev,
        wx = clientX < (left + right) / 2 ? right - clientX : clientX - left,
        wy = clientY < (top + bottom) / 2 ? bottom - clientY : clientY - top;

      rippleMap.current.set(random.str(), {
        x: clientX - left,
        y: clientY - top,
        size: Math.sqrt(wx * wx + wy * wy) / InitSize,
      });

      rerender();
    },
    [props, rerender, rippleMap],
  );

  const rippleNode = Array.from(rippleMap.current.entries()).map(([k, r]) => (
    <div
      key={k}
      data-key={k}
      className={`ripple ${r.end ? "end" : ""}`}
      onAnimationEnd={onAnimationEnd}
      style={{ "--x": r.x, "--y": r.y, "--size": r.size } as never}
    />
  ));

  return (
    <button
      {...props}
      ref={buttonContainer}
      style={{ "--init-size": InitSize, ...props.style } as never}
      className={`material-button ${props.className ?? ""}`}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <div className="ripple-container" children={rippleNode} />
      {props.children}
    </button>
  );
}

export { MaterialButton, MaterialButton as MButton };
