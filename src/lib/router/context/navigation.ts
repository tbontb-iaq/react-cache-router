import { useRouterContext } from "./router";

import { createContext, useContext } from "react";

interface NavConfig {
  method?: "push" | "replace";
  state?: unknown;
  depth?: number;
}

interface Navigation {
  depth: number;
  paths: string[];
  wait(): Promise<void>;
  back(): Promise<void>;
  forward(): Promise<void>;
  go(delta?: number): Promise<void>;
  resolve(path?: string | URL, depth?: number): URL | undefined;
  navTo(url?: string | URL, config?: NavConfig): void;
}

const NavContext = createContext<Navigation | null>(null);

function useNavigation(): Navigation {
  const nav = useContext(NavContext);
  if (nav === null) throw new Error("Navigation context is null!");
  const context = useRouterContext();
  return { ...nav, depth: context.depth };
}

const NAV_EVENT = "navigation";

const dispatchNavEvent = () => dispatchEvent(new CustomEvent(NAV_EVENT));

addEventListener("popstate", dispatchNavEvent);

const createNavigation: () => Navigation = () => ({
  depth: Infinity,
  paths: [],
  wait: () =>
    new Promise((resolve) =>
      addEventListener("popstate", () => resolve(), { once: true }),
    ),
  back() {
    history.back();
    return this.wait();
  },
  forward() {
    history.forward();
    return this.wait();
  },
  go(delta) {
    history.go(delta);
    return this.wait();
  },
  navTo(url, { method = "push", state, depth } = {}) {
    url = this.resolve(url, depth);

    history[`${method}State`](state, "", url);

    dispatchNavEvent();
  },
  resolve(this, path, depth = this.depth) {
    if (path === undefined) return undefined;
    else if (path instanceof URL) return path;

    const base = new URL(location.origin);
    base.pathname = this.paths.slice(0, depth).join("/");
    return new URL(path, base);
  },
});

export type { NavConfig, Navigation };
export { NavContext, useNavigation, NAV_EVENT, createNavigation };
