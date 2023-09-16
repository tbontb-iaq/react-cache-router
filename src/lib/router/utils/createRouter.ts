import {
  DeepRequired,
  Router,
  RouterPartial,
  RouterRaw,
  RouterRequired,
} from "../types";

import _ from "lodash";
import { pathToRegexp } from "path-to-regexp";

const defaultConfig: DeepRequired<
  Omit<RouterPartial, "default"> & Pick<RouterRequired, "component" | "error">
> = {
  cache: {
    limit: 5,
    priority: 0,
    router: { limit: 5, priority: 0 },
    children: { limit: 5, priority: 0 },
  },
  component: () =>
    import("../components/router-view").then((m) => ({
      default: m.RouterView,
    })),
  error: () =>
    import("../components/error").then((m) => ({ default: m.RouteError })),
};

function processRouterRecord(
  router: RouterRaw,
  property: "router" | "children",
) {
  const record = router[property];

  if (record === undefined) return;

  Object.entries(record).forEach(([k, v]) => {
    const [path, rest] = k.split(/\/(.*)/);
    if (path === "index") v.default ??= true;
    else if (path === undefined)
      throw new Error(`Unknown Error: path is undefined`);
    if (rest !== undefined) {
      if (property === "router") v = { router: { [rest]: v } };
      else v = { children: { [rest]: v } };
      delete record[k];
    }

    _.merge(record, {
      [path]: {
        ...v,
        _parent: router,
        _path: path,
        _regex: pathToRegexp(path, undefined, { end: false, strict: true }),
      },
    });

    processRouterRecord(record[path]!, "router");
    processRouterRecord(record[path]!, "children");
  });
}

function createRouter(router: RouterRaw) {
  _.merge(router, defaultConfig);

  processRouterRecord(router, "router");
  processRouterRecord(router, "children");

  return router as Router;
}

export { createRouter };
