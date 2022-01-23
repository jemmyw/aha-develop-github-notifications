import {
  prIdentifierFromUrl,
  PullRequestEnhancement,
} from "./listEnhancedPullRequests";
import { GithubNotification } from "../notifications";
import { ObjectCache } from "../../lib/ObjectCache";

export function uniquePullRequestsFromNotifications(
  notifications: GithubNotification[],
  pullRequestCache: ObjectCache<PullRequestEnhancement>
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
