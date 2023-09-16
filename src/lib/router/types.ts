import { FunctionComponent, ReactNode } from "react";

type ComponentLike<P = unknown> =
  | ReactNode
  | FunctionComponent<P>
  | (() => Promise<{ default: FunctionComponent<P> }>);

interface RouterCache {
  priority: number;
  limit: number;
}

interface RouterNest<T> {
  router: T;
  children: T;
}

interface RouterPartial {
  default: boolean;
  cache: RouterCache & RouterNest<RouterCache>;
}

/**
 * TODO
 *
 * type ExtractRouterParams
 */

/**
 * TODO
 *
 * replace `router` and `children` with `RouterNest`
 */
interface RouterRequired {
  component: ComponentLike;
  error: ComponentLike<{ error: unknown }>;
  router: Record<string, RouterRaw>;
  children: Record<string, RouterRaw>;
}

type RouterRaw = DeepPartial<RouterPartial> & AtLeastOne<RouterRequired>;

type Router = {
  _path: string;
  _regex: RegExp;
  // 在根路由中为 `undefined`
  _parent: Router;
} & Replace<RouterRaw, RouterNest<Record<string, Router>>>;

export type {
  ComponentLike,
  RouterCache,
  RouterPartial,
  RouterRequired,
  RouterRaw,
  Router,
};

// type utils

type Replace<T, U> = {
  [K in keyof T]: K extends keyof U ? U[K] : T[K];
};

type AtLeastOne<T, K extends keyof T = keyof T> = K extends unknown
  ? Pick<T, K> & Partial<Omit<T, K>>
  : never;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] | undefined;
};

type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};

export type { Replace, AtLeastOne, DeepPartial, DeepRequired };
