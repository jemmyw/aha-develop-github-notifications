import {
  atom,
  DefaultValue,
  selector,
  selectorFamily,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { useIncrementPollId } from "../lib/useIncrementPollId";
import { markListRead } from "./helpers/markNotification";
import {
  authTokenState,
  GithubNotification,
  notificationsSelector,
} from "./notifications";

export const markedReadAtom = atom({
  key: "markedReadAtom",
  default: [] as string[],
});

export const notificationMarkedReadSelector = selectorFamily<boolean, string>({
  key: "notificationMarkedReadSelector",
  get:
    (id) =>
    ({ get }) =>
      get(markedReadAtom).includes(id),
  set:
    (id) =>
    ({ set }, newValue) => {
      set(markedReadAtom, (markedRead) => {
        if (!newValue || newValue instanceof DefaultValue) {
          return markedRead.filter((markedId) => markedId !== id);
        } else {
          return [...markedRead, id];
        }
      });
    },
});

export const useMarkListRead = () => {
  const authToken = useRecoilValue(authTokenState);
  const incrementPollId = useIncrementPollId();

  const markAsRead = useRecoilCallback(({ set }) => (ids: string[]) => {
    set(markedReadAtom, (markedRead) => [...markedRead, ...ids]);
  });

  return async (notifications: GithubNotification[], reload?: boolean) => {
    await markAsRead(notifications.map((n) => n.id));

    if (reload) {
      if (!authToken) return;
      await markListRead(authToken, notifications);
      incrementPollId(true);
    }
  };
};
