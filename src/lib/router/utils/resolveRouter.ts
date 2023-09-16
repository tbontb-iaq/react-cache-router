import { Page } from "../context/router";
import { Router } from "../types";

function resolvePath(
  pathname: string,
  entries: [string, Router][],
  end: boolean,
): { path?: string; rest: string; router?: Router } {
  if (pathname.startsWith("/"))
    return {
      path: "",
      rest: pathname.slice(1),
      router: entries.find((p) => p[0] === "")?.[1],
    };

  for (const [, router] of entries) {
    const { 0: path } = pathname.match(router._regex) ?? {};
    if (path?.length)
      return { path, router, rest: pathname.slice(path.length + 1) };
  }

  const [path, router] =
    entries.find(([, v]) => v.default) ??
    (end ? entries.find(([p]) => p === "") : undefined) ??
    [];
  return { path, router, rest: router ? "" : pathname };
}

/*eslint complexity: ['warn', 15] */
function resolveRouter(
  router: Router,
  property: "router" | "children",
  pathname: string,
  path: string | undefined = undefined,
  end = false,
): { pages: Page[]; rest?: string } {
  const pages: Page[] = [];
  const record = router[property];
  const {
    path: new_path,
    rest,
    router: new_router,
  } = resolvePath(pathname, Object.entries(record ?? {}), end);
  if (new_router === undefined)
    if (property === "router") return { pages, rest };
    else throw new Error(`Could not resolve ${pathname}`);

  const not_empty = new_router?.component !== undefined;
  path = ((path && path + "/") ?? "") + (new_path ?? "");

  if (not_empty) pages.push({ path: path, router: new_router });
  const new_end = end || new_path === pathname || new_path + "/" === pathname;
  if (rest.length || !not_empty) {
    const { pages: rt, rest: rs } = resolveRouter(
      new_router,
      property,
      rest,
      not_empty ? undefined : path,
      new_end,
    );
    return { pages: [...pages, ...rt], rest: rs };
  }
  return { pages: pages, rest };
}
export { resolveRouter };
