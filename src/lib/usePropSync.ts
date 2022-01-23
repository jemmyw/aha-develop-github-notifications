import { useEffect } from "react";
import { RecoilState, useSetRecoilState } from "recoil";

/**
 * Sync a local prop to a recoil atom
 */
export function usePropSync(prop: any, value: RecoilState<any>, deps: any[]) {
  const setValue = useSetRecoilState(value);

  useEffect(() => {
    setValue(prop);
  }, deps);
}
