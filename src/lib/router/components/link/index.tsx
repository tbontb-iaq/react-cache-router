import { NavConfig, useNavigation } from "../../context/navigation";

import { AnchorHTMLAttributes, MouseEventHandler, useCallback } from "react";

interface LinkProps
  extends NavConfig,
    React.DetailedHTMLProps<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    > {
  default?: boolean;
  back?: boolean;
  forward?: boolean;
  go?: number;
  to?: string | URL;
  wait?(): void;
}

function RouterLink(props: LinkProps) {
  const nav = useNavigation();
  const url = nav.resolve(props.to);

  const onClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (ev) => {
      if (props.onClick) props.onClick(ev);
      if (props.default) return;
      else ev.preventDefault();

      let promise: Promise<void> | undefined;
      if (props.back) promise = nav.back();
      else if (props.forward) promise = nav.forward();
      else if (props.go) promise = nav.go(props.go);
      else if (props.to) nav.navTo(url, props);

      promise
        ?.then(() => props.wait?.())
        .catch((err) => console.error("Error occurred during navigation", err));
    },
    [nav, props, url],
  );

  return <a {...props} href={url?.href} onClick={onClick} />;
}

export { RouterLink, RouterLink as Link };
