import { Octokit } from "@octokit/rest";
import { ObjectCache } from "../../lib/ObjectCache";
import {
  GetPrsPullRequestEnhancement,
  listEnhancedPullRequests,
  prIdentifierFromUrl,
  PullRequestEnhancement,
} from "./listEnhancedPullRequests";

export async function populatePullRequestCache(
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
