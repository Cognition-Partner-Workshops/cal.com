import { useRef, useEffect } from "react";

export function useTraceUpdate(props: { [s: string]: unknown } | ArrayLike<unknown>) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error TODO: fix this
      if (prev.current[k] !== v) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error TODO: fix this
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    prev.current = props;
  });
}
