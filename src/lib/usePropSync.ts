import { useEffect } from "react";
import { RecoilState, useRecoilState, useSetRecoilState } from "recoil";

export function usePropSync(prop: any, value: RecoilState<any>, deps: any[]) {
  const setValue = useSetRecoilState(value);

  useEffect(() => {
    setValue(prop);
  }, deps);
}
