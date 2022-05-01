import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { atom, noWait, selector } from "recoil";
import { ObjectCache } from "../lib/ObjectCache";
import {
  listNotifications,
  listNotificationsOptions,
} from "./helpers/listNotifications";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
type GithubNotifications =
  RestEndpointMethodTypes["activity"]["listNotificationsForAuthenticatedUser"]["response"]["data"];
type OctokitNotificationsResponse = ThenArg<
  ReturnType<typeof listNotifications>
>;
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
const notificationsCache = new ObjectCache<OctokitNotificationsResponse>(
  "listNotifications"
);

const notificationsCacheKey = (
  id: number,
  authToken: string,
  options: listNotificationsOptions
) => `${id}_${authToken}_${JSON.stringify(options)}`;

export const listNotificationsSelector = selector({
  key: "listNotifications",
  get: async ({ get }) => {
    const id = get(pollId);
    console.log("listNotificationsSelector", id);
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

    const setCache = (response: OctokitNotificationsResponse) => {
      notificationsCache.clear();
      notificationsCache.set(
        notificationsCacheKey(id, authToken, options),
        response
      );
      return { ...response, pollId: id };
    };

    try {
      const response = await listNotifications(api, options, lastModified);
      return setCache(response);
    } catch (err) {
      const error = err as any;

      if (error.status === 304 && priorResponse) {
        return setCache(priorResponse);
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
    return notifications?.data || [];
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

export const loadingState = selector({
  key: "loading",
  get: ({ get }) => {
    const state = get(noWait(listNotificationsSelector));
    console.log(state);
    return state.state === "loading";
  },
});
