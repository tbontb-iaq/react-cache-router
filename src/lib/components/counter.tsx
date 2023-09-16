import { useState } from "react";

function Counter({ name }: { name?: string }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>
        {name ?? "unknown"}: {count}
      </p>
      <button onPointerUp={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
}

export { Counter };
