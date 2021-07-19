import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { selector } from "recoil";
import { IDENTIFIER } from "../extension";
import { ObjectCache } from "../lib/ObjectCache";
import {
  GetPrsPullRequestEnhancement,
  listEnhancedPullRequests,
  prIdentifierFromUrl,
  PullRequestEnhancement,
} from "./helpers/listEnhancedPullRequests";
import {
  authTokenState,
  GithubNotification,
  notificationsSelector,
} from "./notifications";

export type GithubComment =
  RestEndpointMethodTypes["issues"]["getComment"]["response"]["data"];

export interface NotificationEnhancements {
  pullRequest?: PullRequestEnhancement;
  comment?: GithubComment;
}

let pullRequestCache = new ObjectCache<PullRequestEnhancement>(
  IDENTIFIER + "_pullRequests"
);
let commentCache = new ObjectCache<GithubComment>(IDENTIFIER + "_comments");

export const enhancedNotifications = selector({
  key: "enhancedNotifications",
  get: async ({ get }) => {
    const authToken = get(authTokenState);
    const notifications = get(notificationsSelector);

    if (authToken === null) {
      return {};
    }

    const api = new Octokit({ auth: authToken });

    const pullRequestIdentifiers =
      uniquePullRequestsFromNotifications(notifications);
    await populatePullRequestCache(
      api,
      pullRequestCache,
      pullRequestIdentifiers
    );

    const commentUrls = [
      ...new Set(notifications.map((n) => n.subject.latest_comment_url)),
    ].filter((url) => url && url.includes("/comments/"));
    await populateCommentCache(api, commentCache, commentUrls);

    return notifications.reduce((acc, notification) => {
      const enhancements: NotificationEnhancements = {};

      if (notification.subject.type === "PullRequest") {
        enhancements["pullRequest"] = pullRequestCache.get(
          prIdentifierFromUrl(notification.subject.url)
        );
      }

      enhancements["comment"] = commentCache.get(
        notification.subject.latest_comment_url
      );

      return { ...acc, [notification.id]: enhancements };
    }, {} as { [key: string]: NotificationEnhancements });
  },
});

function repoFromUrl(url: string): [string, string] | [] {
  const match = url.match(/\/repos\/([^\/]+)\/([^\/]+)\//);
  if (match) {
    return [match[1], match[2]];
  }

  return [];
}

async function populateCommentCache(
  api: Octokit,
  cache: ObjectCache<any>,
  commentUrls: string[]
) {
  await Promise.all(
    commentUrls.map(async (url) => {
      if (!cache.has(url)) {
        const id = url.split("/").slice(-1)[0];
        const [owner, repo] = repoFromUrl(url);

        if (!id || !owner || !repo) return;

        const response = await api.rest.issues.getComment({
          comment_id: Number(id),
          owner,
          repo,
        });

        cache.set(url, response.data);
      }
    })
  );

  cache.persist();
}

async function populatePullRequestCache(
  api: Octokit,
  cache: ObjectCache<PullRequestEnhancement>,
  pullRequestIdentifiers: string[]
) {
  if (pullRequestIdentifiers.length > 0) {
    const response: GetPrsPullRequestEnhancement =
      await listEnhancedPullRequests(pullRequestIdentifiers, api);

    Object.values(response).forEach(({ pullRequest }) => {
      cache.set(prIdentifierFromUrl(pullRequest.url), pullRequest);
    });

    cache.persist();
  }
}

function uniquePullRequestsFromNotifications(
  notifications: GithubNotification[]
) {
  return [
    ...new Set(
      notifications
        .filter((n) => n.subject.type === "PullRequest")
        .filter(
          (n) =>
            !pullRequestCache.hasSince(
              prIdentifierFromUrl(n.subject.url),
              new Date(n.updated_at).getTime()
            )
        )
        .map((n) => n.subject.url)
    ),
  ].map((url) => prIdentifierFromUrl(url));
}
