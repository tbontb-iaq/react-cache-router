import { Router, RouterPartial } from "../types";

import { createContext, useContext } from "react";

interface Page {
  path: string;
  router: Router;
  props?: unknown;
  error?: unknown;
}

interface RouterContextObject {
  depth: number;
  cache: RouterPartial["cache"];
  page: Page[];
}

const RouterContext = createContext<RouterContextObject | null>(null);

function useRouterContext() {
  const context = useContext(RouterContext);
  if (context === null) throw new Error("Router context is null!");
  return context;
}

export type { Page, RouterContextObject };
export { RouterContext, useRouterContext };
