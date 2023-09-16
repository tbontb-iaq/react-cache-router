import { MutableRefObject, useRef } from "react";

function useRefInit<T>(initialFunc: () => T): MutableRefObject<T>;
function useRefInit<T>(initialValue: T): MutableRefObject<T>;

function useRefInit<T>(initialState: T | (() => T)) {
  const ref = useRef<T | undefined>(undefined);

  if (ref.current === undefined) {
    ref.current =
      initialState instanceof Function ? initialState() : initialState;
  }

  return ref;
}

export { useRefInit };
