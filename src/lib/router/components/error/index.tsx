import style from "./index.module.css";

import { useEffect, useMemo } from "react";

function RouteError({ error }: { error: unknown }) {
  useEffect(() => {
    console.error("Route Error: ", error);
  }, [error]);

  const detail = useMemo(
    () =>
      error instanceof Error ? (
        <>
          <p>
            {error.name}: {error.message}{" "}
          </p>
          {Boolean(error.cause) && <p>Cause: {error.cause as never}</p>}
        </>
      ) : (
        <p>Unknown: {error as never}</p>
      ),
    [error],
  );

  return <div className={style.container} children={detail} />;
}

export { RouteError };
