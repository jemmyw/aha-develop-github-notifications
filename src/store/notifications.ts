import { RestEndpointMethodTypes } from "@octokit/rest";
import { atom, selector } from "recoil";
import { listNotificationsOptions } from "./helpers/listNotifications";

interface NotificationsState {
  lastModified: string | null;
  notifications: GithubNotification[];
}

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
type GithubNotifications =
  RestEndpointMethodTypes["activity"]["listNotificationsForAuthenticatedUser"]["response"]["data"];
export type GithubNotification = ArrayElement<GithubNotifications>;

export const authTokenState = atom<string | null>({
  key: "authToken",
  default: null,
});

export const nextPollAtState = atom<number | null>({
  key: "nextPollAt",
  default: null,
});

export const optionsState = atom<listNotificationsOptions>({
  key: "options",
  default: {
    onlyParticipating: true,
    showRead: false,
  },
});

export const notificationsState = atom<GithubNotification[]>({
  default: [],
  key: "notifications",
});

export const unreadCountSelector = selector({
  key: "unreadCount",
  get: ({ get }) => get(notificationsState).filter((n) => n.unread).length,
});

export const loadingState = atom({ key: "loading", default: false });
