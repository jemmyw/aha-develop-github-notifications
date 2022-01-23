import { Octokit } from "@octokit/rest";
import { ObjectCache } from "../../lib/ObjectCache";
import { repoFromUrl } from "./repoFromUrl";

export async function populateCommentCache(
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

        try {
          const response = await api.rest.issues.getComment({
            comment_id: Number(id),
            owner,
            repo,
          });

          cache.set(url, response.data);
        } catch (err) {}
      }
    })
  );

  cache.persist();
}
