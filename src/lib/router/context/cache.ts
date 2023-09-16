import { Page } from "./router";

import { useRefInit } from "@/lib/hooks/ref-init";

import QuickLRU from "quick-lru";
import { createContext, useContext, useEffect, useMemo } from "react";

type CacheEffect = () => void | (() => void);

interface CacheInfo {
  page: Page;
  active: boolean;
  onActivated: CacheEffect[];
  onDeactivated: CacheEffect[];
}

interface CacheContextObject {
  page?: Page;

  drop(page: Page): void;
  effect(page: Page, callback: CacheEffect): void;
}

const CacheContext = createContext<CacheContextObject | null>(null);

function useCacheContext() {
  const context = useContext(CacheContext);
  if (context === null) throw new Error("Cache context is null!");
  return { context, page: useMemo(() => context.page, [context]) };
}

function usePath() {
  const { page } = useCacheContext();
  return page?.path;
}

function useDrop() {
  const { context, page } = useCacheContext();
  return () => page && context.drop(page);
}

function useCacheEffect(effect: CacheEffect) {
  const { context, page } = useCacheContext();
  useEffect(() => {
    page && context.effect(page, effect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, page]);
}

function useCreateCacheContext(limit: number, total_limit: number) {
  const nodeCache = useRefInit(
    () =>
      new QuickLRU<string, QuickLRU<string, CacheInfo>>({ maxSize: Infinity }),
  );

  const context: CacheContextObject = useMemo(
    () => ({
      page: undefined,
      drop(page) {
        nodeCache.current.peek(page.router._path)?.delete(page.path);
      },
      effect(page, callback) {
        nodeCache.current
          .peek(page.router._path)
          ?.peek(page.path)
          ?.onDeactivated.push(callback);
      },
    }),
    [nodeCache],
  );

  const pageCache = useMemo(
    () => ({
      cache(page: Page) {
        if (!nodeCache.current.has(page.router._path))
          nodeCache.current.set(
            page.router._path,
            new QuickLRU({ maxSize: page.router.cache?.limit ?? limit }),
          );
        const cache = nodeCache.current.get(page.router._path)!;
        if (cache.has(page.path)) cache.get(page.path)!.active = true;
        else {
          cache.set(page.path, {
            page,
            active: true,
            onActivated: [],
            onDeactivated: [],
          });
        }

        if (
          Array.from(nodeCache.current.values()).reduce(
            (p, c) => p + c.size,
            0,
          ) > total_limit
        ) {
          const i = nodeCache.current.entriesDescending().next();
          if (!i.done) {
            const [router_path, cache] = i.value;
            if (cache.size === 1) nodeCache.current.delete(router_path);
            else {
              const { size, maxSize } = cache;
              cache.resize(size - 1);
              cache.resize(maxSize);
            }
          }
        }
      },

      deactivate(page: Page) {
        const cache = nodeCache.current
          .peek(page.router._path)
          ?.peek(page.path);
        cache && (cache.active = false);
      },

      values: () =>
        Array.from(nodeCache.current.values())
          .map((c) => Array.from(c.values()))
          .flat(1),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodeCache],
  );

  return { context, pageCache };
}

export {
  CacheContext,
  useCreateCacheContext,
  useCacheContext,
  useDrop,
  useCacheEffect,
  usePath,
};

export type { CacheContextObject, CacheInfo };
