import { useEffect, useState } from "react";
import { RecoilValue, useRecoilValueLoadable } from "recoil";

type CachedLoadableState =
  | "hasValue"
  | "hasError"
  | "loading"
  | "hasCachedValue";

export function useRecoilCachedLoadble<T>(
  recoilValue: RecoilValue<T>,
  initialValue: T
): [T, CachedLoadableState] {
  const [cachedData, setCache] = useState<T>(initialValue);
  const loadable = useRecoilValueLoadable<T>(recoilValue);

  useEffect(() => {
    if (loadable.state === "hasValue") {
      setCache(loadable.valueMaybe());
    }
  }, [loadable]);

  let state: CachedLoadableState = loadable.state;

  if (loadable.state === "loading" && cachedData) {
    state = "hasCachedValue";
  }

  return [cachedData, state];
}
