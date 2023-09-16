import {
  NAV_EVENT,
  NavContext,
  createNavigation,
} from "../../context/navigation";
import { Page, RouterContext, RouterContextObject } from "../../context/router";
import { Router } from "../../types";
import { resolveRouter } from "../../utils/resolveRouter";
import { RouterView } from "../router-view";

import _ from "lodash";
import { ReactNode, useEffect, useMemo, useState } from "react";

const getPathname = () => location.pathname.slice(1);

function RouterProvider({
  router,
  children = <RouterView />,
}: {
  router: Router;
  children?: ReactNode;
}) {
  const [path, setPath] = useState(getPathname());

  const navigation = useMemo(() => createNavigation(), []);

  const pages = useMemo(() => {
    const pages: Page[] = [{ path: "#root#", router }];
    const { pages: p, rest } = resolveRouter(router, "router", path);
    const last = _.last(p);

    if (last === undefined)
      pages[0] = {
        path,
        router,
        error: new Error(`Could not resolve path '${path}'`),
      };
    else {
      pages.push(last);
      if (rest) {
        try {
          pages.push(...resolveRouter(last.router, "children", rest).pages);
        } catch (error) {
          pages.push({
            path: rest,
            router: last.router,
            error: new Error(`Could not resolve path '${rest}'`),
          });
        }
      }
    }
    return pages;
  }, [path, router]);

  const context: RouterContextObject = useMemo(
    () => ({
      depth: -1,
      page: pages,
      cache: router.cache as never,
    }),
    [router.cache, pages],
  );

  useEffect(() => {
    const listener = () => setPath(getPathname());
    addEventListener(NAV_EVENT, listener);
    return () => removeEventListener(NAV_EVENT, listener);
  }, []);

  useEffect(() => {
    const paths = pages.slice(1).map((v) => v.path);
    navigation.paths = paths;

    const url = navigation.resolve("/" + paths.join("/"));
    if (url?.pathname !== location.pathname)
      navigation.navTo(url, { method: "replace" });
  }, [navigation, pages]);

  return (
    <RouterContext.Provider value={context}>
      <NavContext.Provider value={navigation} children={children} />
    </RouterContext.Provider>
  );
}

export { RouterProvider };
