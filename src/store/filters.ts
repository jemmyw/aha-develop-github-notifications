import { atom, selector, selectorFamily } from "recoil";
import { IDENTIFIER } from "../extension";
import { enhancedNotifications } from "./enhance";
import { PullRequestState } from "./helpers/listEnhancedPullRequests";
import { localStorageEffect } from "./localStorageEffect";
import { markedReadAtom } from "./read";

interface Filters {
  labels: string[];
  states: PullRequestState[];
}

export const showFilterAtom = atom({
  key: "showFilters",
  default: false,
});

export const filtersAtom = atom<Filters>({
  key: "filters",
  default: { labels: [], states: [] },
  effects_UNSTABLE: [localStorageEffect([IDENTIFIER, "filters"].join("."))],
});

export const filterSelector = selectorFamily<string[], keyof Filters>({
  key: "filterSelector",
  get:
    (name) =>
    ({ get }) => {
      return get(filtersAtom)[name] as string[];
    },
  set:
    (name) =>
    ({ set, get }, newValue) => {
      const filters = get(filtersAtom);
      set(filtersAtom, { ...filters, [name]: newValue });
    },
});

export const filterActiveSelector = selector({
  key: "filterActiveSelector",
  get: ({ get }) => {
    const filters = get(filtersAtom);
    return filters.labels.length > 0 || filters.states.length > 0;
  },
});

export const filteredNotificationsSelector = selector({
  key: "filteredNotificationsSelector",
  get: ({ get }) => {
    const notifications = get(enhancedNotifications);
    const filters = get(filtersAtom);
    const active = get(filterActiveSelector);

    if (!active) return notifications;

    return notifications.filter((notification) => {
      if (filters.labels.length > 0) {
        if (
          !notification.pullRequest?.labels.nodes
            .map((l) => l.name)
            .some((l) => filters.labels.includes(l))
        )
          return false;
      }

      if (filters.states.length > 0) {
        if (!filters.states.includes(notification.pullRequest?.state as any))
          return false;
      }

      return true;
    });
  },
});

export const filteredUnreadCountSelector = selector({
  key: "filteredUnreadCountSelector",
  get: ({ get }) => {
    const filteredNotifications = get(filteredNotificationsSelector);
    const makredRead = get(markedReadAtom);
    return filteredNotifications.filter(
      (n) => n.notification.unread && !makredRead.includes(n.notification.id)
    ).length;
  },
});
