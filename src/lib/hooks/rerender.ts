import { useState } from "react";

function useRerender() {
  const [, setCount] = useState(0);
  return () => setCount((v) => v + 1);
}

export { useRerender };
