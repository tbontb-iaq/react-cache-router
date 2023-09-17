import { useCallback, useState } from "react";

function useRerender() {
  const [, setCount] = useState(0);
  return useCallback(() => setCount((v) => v + 1), []);
}

export { useRerender };
