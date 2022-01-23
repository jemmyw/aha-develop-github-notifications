import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { selector } from "recoil";
import { IDENTIFIER } from "../extension";
import { ObjectCache } from "../lib/ObjectCache";
import {
  Label,
  prIdentifierFromUrl,
  PullRequestEnhancement,
} from "./helpers/listEnhancedPullRequests";
import {
  authTokenState,
  GithubNotification,
  notificationsSelector,
} from "./notifications";
import { populatePullRequestCache } from "./helpers/populatePullRequestCache";
import { uniquePullRequestsFromNotifications } from "./helpers/uniquePullRequestsFromNotifications";
import { populateCommentCache } from "./helpers/populateCommentCache";

export type GithubComment =
  RestEndpointMethodTypes["issues"]["getComment"]["response"]["data"];

export interface EnhancedNotification {
  notification: GithubNotification;
  pullRequest?: PullRequestEnhancement;
  comment?: GithubComment;
}

let pullRequestCache = new ObjectCache<PullRequestEnhancement>(
  IDENTIFIER + "_pullRequests"
);
let commentCache = new ObjectCache<GithubComment>(IDENTIFIER + "_comments");

const apiSelector = selector({
  key: "apiSelector",
  get: ({ get }) => {
    const authToken = get(authTokenState);
    if (authToken === null) return null;
    return new Octokit({ auth: authToken });
  },
});

const pullRequestsSelector = selector({
  key: "pullRequestsSelector",
  get: async ({ get }) => {
    const notifications = get(notificationsSelector);
    const api = get(apiSelector);
    if (!api) return pullRequestCache;

    const pullRequestIdentifiers = uniquePullRequestsFromNotifications(
      notifications,
      pullRequestCache
    );
    await populatePullRequestCache(
      api,
      pullRequestCache,
      pullRequestIdentifiers
    );

    return pullRequestCache;
  },
});

const commentUrlsSelector = selector({
  key: "commentUrlsSelector",
  get: ({ get }) => {
    const notifications = get(notificationsSelector);

    return [
      ...new Set(notifications.map((n) => n.subject.latest_comment_url)),
    ].filter((url) => url && url.includes("/comments/"));
  },
});

const commentsSelector = selector({
  key: "commentsSelector",
  get: async ({ get }) => {
    const api = get(apiSelector);
    if (!api) return commentCache;
    const commentUrls = get(commentUrlsSelector);
    await populateCommentCache(api, commentCache, commentUrls);
    return commentCache;
  },
});

export const enhancedNotifications = selector({
  key: "enhancedNotifications",
  get: async ({ get }) => {
    const notifications = get(notificationsSelector);
    const comments = get(commentsSelector);
    const pullRequests = get(pullRequestsSelector);

    return notifications.reduce((acc, notification) => {
      const enhancements: EnhancedNotification = { notification };

      if (notification.subject.type === "PullRequest") {
        enhancements["pullRequest"] = pullRequests.get(
          prIdentifierFromUrl(notification.subject.url)
        );
      }

      enhancements["comment"] = comments.get(
        notification.subject.latest_comment_url
      );

      acc.push(enhancements);
      return acc;
    }, [] as EnhancedNotification[]);
  },
});

export const uniqueLabelsSelector = selector({
  key: "uniqueLabelsSelector",
  get: ({ get }) => {
    const pullRequests = get(pullRequestsSelector);
    return [
      ...pullRequests
        .values()
        .reduce((acc, pr) => {
          pr.labels.nodes.forEach((label) => acc.set(label.name, label));
          return acc;
        }, new Map<string, Label>())
        .values(),
    ].sort((a, b) => a.name.localeCompare(b.name));
  },
});
