import { RestEndpointMethodTypes } from "@octokit/rest";
import { atom, DefaultValue, selector } from "recoil";
import { IDENTIFIER } from "../extension";

interface NotificationsState {
  lastModified: string | null;
  notifications: GithubNotification[];
}

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
type GithubNotifications =
  RestEndpointMethodTypes["activity"]["listNotificationsForAuthenticatedUser"]["response"]["data"];
export type GithubNotification = ArrayElement<GithubNotifications>;

export const notificationsState = atom<GithubNotification[]>({
  default: [],
  key: "notifications",
});

export const unreadCountSelector = selector({
  key: "unreadCount",
  get: ({ get }) => get(notificationsState).filter((n) => n.unread).length,
});

export const loadingState = atom({ key: "loading", default: false });
