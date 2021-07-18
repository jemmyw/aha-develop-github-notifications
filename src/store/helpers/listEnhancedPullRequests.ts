import { Octokit } from "@octokit/rest";
import gql from "gql-tag";
import { prInfoFromIdentifier, pullRequestQuery } from "../enhance";

export interface PullRequestEnhancement {
  id: number;
  number: number;
  title: string;
  url: string;
  labels: {
    nodes: Label[];
  };
}

export interface GetPrsPullRequestEnhancement {
  [key: string]: {
    pullRequest: PullRequestEnhancement;
  };
}

export interface Label {
  name: string;
  color: string;
}

export async function listEnhancedPullRequests(
  pullRequestInfo: string[],
  api: Octokit
) {
  const [queries, params, variables] = pullRequestInfo.reduce(
    (acc, prInfo, idx) => {
      const queries = acc[0];
      const params = acc[1];
      const variables = acc[2];
      const [owner, repo, number] = prInfoFromIdentifier(prInfo);
      const alias = `pr_${idx}`;

      return [
        [...queries, pullRequestQuery(alias, idx)],
        [
          ...params,
          `$owner_${idx}: String!`,
          `$repo_${idx}: String!`,
          `$number_${idx}: Int!`,
        ],
        {
          ...variables,
          [`owner_${idx}`]: owner,
          [`repo_${idx}`]: repo,
          [`number_${idx}`]: Number(number),
        },
      ];
    },
    [[], [], {}] as [string[], string[], Record<string, any>]
  );

  const query = gql`
        query GetPrs(${params.join(", ")}) {
          ${queries.join("\n")}
        }

        fragment PullRequestInfo on PullRequest {
          id
          number
          title
          url
          labels(first: 4) {
            nodes {
              name
              color
            }
          }
        }
      `;

  return (await api.graphql(query, variables)) as GetPrsPullRequestEnhancement;
}
