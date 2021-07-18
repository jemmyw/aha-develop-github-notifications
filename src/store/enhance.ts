import { Octokit } from "@octokit/rest";
import gql from "gql-tag";
import { selector } from "recoil";
import { IDENTIFIER } from "../extension";
import {
  GetPrsPullRequestEnhancement,
  listEnhancedPullRequests,
  PullRequestEnhancement,
} from "./helpers/listEnhancedPullRequests";
import { authTokenState, notificationsState } from "./notifications";
import { ObjectCache } from "../lib/ObjectCache";

const prIdentifierFromUrl = (url: string) => {
  const parts = url.split("?")[0].split("/").slice(-4);
  return [parts[0], parts[1], parts[3]].join("/");
};

export const prInfoFromIdentifier = (id: string) => id.split("/");

export const pullRequestQuery = (alias: string, idx: number) => {
  return gql`
    ${alias}: repository(owner: $owner_${idx}, name: $repo_${idx}) {
      pullRequest(number: $number_${idx}) {
        ...PullRequestInfo
      }
    }
  `;
};

let pullRequestCache = new ObjectCache<PullRequestEnhancement>(
  IDENTIFIER + "_pullRequests"
);

export const enhancedNotifications = selector({
  key: "enhancedNotifications",
  get: async ({ get }) => {
    const authToken = get(authTokenState);
    const notifications = get(notificationsState);

    if (authToken === null) {
      return {};
    }

    const api = new Octokit({ auth: authToken });

    const pullRequestInfo = [
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

    if (pullRequestInfo.length > 0) {
      const response: GetPrsPullRequestEnhancement =
        await listEnhancedPullRequests(pullRequestInfo, api);

      Object.values(response).forEach(({ pullRequest }) => {
        pullRequestCache.set(prIdentifierFromUrl(pullRequest.url), pullRequest);
      });

      pullRequestCache.persist();
    }

    return notifications.reduce((acc, notification) => {
      const enhancements: {
        pullRequest?: PullRequestEnhancement;
      } = {};

      if (notification.subject.type === "PullRequest") {
        enhancements["pullRequest"] = pullRequestCache.get(
          prIdentifierFromUrl(notification.subject.url)
        );
      }

      return { ...acc, [notification.id]: enhancements };
    }, {} as { [key: string]: NotificationEnhancements });
  },
});

export interface NotificationEnhancements {
  pullRequest?: PullRequestEnhancement;
}
