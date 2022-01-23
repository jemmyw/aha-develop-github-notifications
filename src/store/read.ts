import {
  atom,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { useIncrementPollId } from "../lib/useIncrementPollId";
import { markListRead } from "./helpers/markNotification";
import { authTokenState, GithubNotification } from "./notifications";

export const markedReadAtom = atom({
  key: "markedReadAtom",
  default: new Set<string>(),
});

export const notificationMarkedReadSelector = selectorFamily<boolean, string>({
  key: "notificationMarkedReadSelector",
  get:
    (id) =>
    ({ get }) => {
      return get(markedReadAtom).has(id);
    },
  set:
    (id) =>
    ({ set, get }, newValue) => {
      const markedRead = get(markedReadAtom);

      if (!newValue || newValue instanceof DefaultValue) {
        markedRead.delete(id);
      } else {
        markedRead.add(id);
      }

      set(markedReadAtom, markedRead);
    },
});

export const useMarkListRead = () => {
  const [markedRead, setMarkedRead] = useRecoilState(markedReadAtom);
  const authToken = useRecoilValue(authTokenState);
  const incrementPollId = useIncrementPollId();

  return async (notifications: GithubNotification[]) => {
    if (!authToken) return;

    notifications.forEach((n) => markedRead.add(n.id));
    setMarkedRead(markedRead);

    await markListRead(authToken, notifications);

    incrementPollId(true);
  };
};
