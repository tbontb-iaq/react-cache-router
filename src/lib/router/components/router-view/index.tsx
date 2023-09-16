import { CacheContext, useCreateCacheContext } from "../../context/cache";
import {
  Page,
  RouterContext,
  RouterContextObject,
  useRouterContext,
} from "../../context/router";
import { RouterCache } from "../router-cache";

import _ from "lodash";
import { JSX, useEffect, useMemo, useState } from "react";

/**
 * TODO 分类缓存
 */

function RouterView() {
  const {
    depth,
    cache,
    page: [first, ...rest],
  } = useRouterContext();

  const newContext: RouterContextObject = useMemo(
    () => ({
      depth: depth + 1,
      cache: _.merge(cache, first?.router.cache),
      page: rest,
    }),
    [cache, depth, first?.router.cache, rest],
  );

  const { context: cacheContext, pageCache } = useCreateCacheContext(
    cache.limit,
    depth <= 1 ? cache.router.limit : cache.children.limit,
  );

  const [oldPage, setOldPage] = useState<Page | undefined>();
  const [nodes, setNodes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const path = first?.path;
    if (path !== oldPage?.path) {
      first && pageCache.cache(first);

      oldPage && pageCache.deactivate(oldPage);

      setOldPage(first);

      setNodes(
        pageCache
          .values()
          .map((info) => <RouterCache key={info.page.path} {...info} />),
      );
    }
  }, [first, oldPage, pageCache]);

  cacheContext.page = first;

  return (
    <RouterContext.Provider value={newContext}>
      <CacheContext.Provider value={cacheContext}>
        {nodes}
      </CacheContext.Provider>
    </RouterContext.Provider>
  );
}

export { RouterView };
