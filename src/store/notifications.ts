import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { atom, DefaultValue, noWait, selector, selectorFamily } from "recoil";
import { IDENTIFIER } from "../extension";
import { ObjectCache } from "../lib/ObjectCache";
import {
  listNotifications,
  listNotificationsOptions,
} from "./helpers/listNotifications";
import { localStorageEffect } from "./localStorageEffect";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
type GithubNotifications =
  RestEndpointMethodTypes["activity"]["listNotificationsForAuthenticatedUser"]["response"]["data"];
export type GithubNotification = ArrayElement<GithubNotifications>;

export const authTokenState = atom<string | null>({
  key: "authToken",
  default: null,
});

export const pollId = atom<number>({
  key: "pollId",
  default: 0,
});

export const optionsState = atom<listNotificationsOptions>({
  key: "options",
  default: {
    onlyParticipating: true,
    showRead: false,
  },
});

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
const notificationsCache = new ObjectCache<
  ThenArg<ReturnType<typeof listNotifications>>
>("listNotifications");

const notificationsCacheKey = (
  id: number,
  authToken: string,
  options: listNotificationsOptions
) => `${id}_${authToken}_${JSON.stringify(options)}`;

export const listNotificationsSelector = selector({
  key: "listNotifications",
  get: async ({ get }) => {
    const id = get(pollId);
    const authToken = get(authTokenState);
    if (!authToken) {
      return null;
    }

    const options = get(optionsState);
    const api = new Octokit({
      auth: authToken,
    });

    const priorResponse = notificationsCache.get(
      notificationsCacheKey(id - 1, authToken, options)
    );

    let lastModified = priorResponse?.headers["last-modified"] || null;

    const setCache = (response: any) => {
      notificationsCache.clear();
      notificationsCache.set(
        notificationsCacheKey(id, authToken, options),
        response
      );
    };

    try {
      const response = await listNotifications(api, options, lastModified);
      setCache(response);
      return response;
    } catch (error) {
      if (error.status === 304 && priorResponse) {
        setCache(priorResponse);
        return priorResponse;
      } else {
        throw error;
      }
    }
  },
  set: ({ get, set }, newValue: any) => {
    const id = get(pollId);
    const authToken = get(authTokenState);
    const options = get(optionsState);
    if (!authToken) {
      notificationsCache.clear();
    } else {
      notificationsCache.remove(notificationsCacheKey(id, authToken, options));
    }
    set(pollId, id + 1);
  },
});

export const lastModifiedSelector = selector<string | null>({
  key: "lastModified",
  get: ({ get }) => {
    const response = get(listNotificationsSelector);
    return response?.headers["last-modified"] || null;
  },
});

export const notificationsSelector = selector<GithubNotification[]>({
  key: "notifications",
  get: ({ get }) => {
    const notifications = get(listNotificationsSelector);
    if (!notifications) return [];
    return notifications.data || [];
  },
});

export const nextPollAtSelector = selector({
  key: "nextPollAt",
  get: ({ get }) => {
    const response = get(listNotificationsSelector);
    if (!response) return null;

    const pollInterval = Number(response.headers["x-poll-interval"] || 60);
    return new Date(Date.now() + 1000 * pollInterval);
  },
});

export const unreadCountSelector = selector({
  key: "unreadCount",
  get: ({ get }) => get(notificationsSelector).filter((n) => n.unread).length,
});

export const loadingState = selector({
  key: "loading",
  get: ({ get }) => {
    const state = get(noWait(listNotificationsSelector));
    return state.state === "loading";
  },
});
