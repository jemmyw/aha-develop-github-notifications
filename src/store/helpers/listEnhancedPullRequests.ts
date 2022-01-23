import { Octokit } from "@octokit/rest";
import gql from "gql-tag";

export type PullRequestState = "OPEN" | "CLOSED" | "MERGED";

export interface PullRequestEnhancement {
  id: number;
  number: number;
  title: string;
  url: string;
  state: PullRequestState;
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

const pullRequestQuery = (alias: string, idx: number) => {
  return gql`
    ${alias}: repository(owner: $owner_${idx}, name: $repo_${idx}) {
      pullRequest(number: $number_${idx}) {
        ...PullRequestInfo
      }
    }
  `;
};

export const prInfoFromIdentifier = (id: string) => id.split("/");

export const prIdentifierFromUrl = (url: string) => {
  const parts = url.split("?")[0].split("/").slice(-4);
  return [parts[0], parts[1], parts[3]].join("/");
};

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
          state
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

export const PULL_REQUEST_STATES: Record<
  PullRequestState,
  { name: PullRequestState; backgroundColor: string; color: string }
> = {
  OPEN: {
    name: "OPEN",
    backgroundColor: "#e5f3d6",
    color: "#4f8f0e",
  },
  MERGED: {
    name: "MERGED",
    color: "#564169",
    backgroundColor: "#e5dced",
  },
  CLOSED: {
    name: "CLOSED",
    color: "#992e0b",
    backgroundColor: "#fae7e1",
  },
};
