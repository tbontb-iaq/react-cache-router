import { CacheInfo } from "../../context/cache";
import { Page } from "../../context/router";
import { ComponentLike } from "../../types";
import "./index.css";

import React, {
  FunctionComponent,
  ReactNode,
  Suspense,
  useEffect,
  useMemo,
} from "react";
import { ErrorBoundary } from "react-error-boundary";

function Component<P = unknown>({
  component,
  props,
}: {
  component:
    | FunctionComponent<P>
    | (() => Promise<{ default: FunctionComponent<P> }>);
  props: P;
}) {
  const result = component(props);

  const LazyWrapper = React.lazy(() =>
    result instanceof Promise
      ? result.then((v) => ({ default: () => v.default(props) }))
      : Promise.resolve({ default: () => result }),
  );

  return <Suspense fallback={"Loading"} children={<LazyWrapper />} />;
}

function resolveComponent<P>(
  component: ComponentLike<P>,
  props: unknown,
): ReactNode {
  if (typeof component === "function") {
    return <Component<P> component={component} props={props as never} />;
  } else return component;
}

function resolvePage(page: Page): ReactNode {
  if (page.error) {
    const err = page.router.error ?? page.router._parent.error;
    if (err) return resolveComponent(err, page);
    else throw page.error;
  } else {
    return resolveComponent(page.router.component, page.props);
  }
}

function RouterCache({ page, active, onActivated, onDeactivated }: CacheInfo) {
  const node = useMemo(() => resolvePage(page), [page]);
  const err = page.router.error ?? page.router._parent.error;
  const child = err ? (
    <ErrorBoundary
      fallbackRender={(p) => resolveComponent(err, p)}
      children={node}
    />
  ) : (
    node
  );

  useEffect(() => {
    if (active) onActivated.splice(0).forEach((callback) => callback());
    else
      onDeactivated.forEach((callback) => {
        const result = callback();
        typeof result === "function" && onActivated.push(result);
      });
  }, [active, onActivated, onDeactivated, page.path]);

  return (
    <div
      className={"router-cache" + (active ? " active" : "")}
      data-path={page.path}
      children={child}
    />
  );
}

export { RouterCache };
