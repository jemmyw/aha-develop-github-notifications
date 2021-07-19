import { Octokit } from "@octokit/rest";

export interface listNotificationsOptions {
  showRead: boolean;
  onlyParticipating: boolean;
}

export async function listNotifications(
  api: Octokit,
  { showRead, onlyParticipating }: listNotificationsOptions,
  lastModified: string | null
) {
  const headers: Record<string, string> = {};

  headers["If-Modified-Since"] = lastModified || "";

  return await api.rest.activity.listNotificationsForAuthenticatedUser({
    all: showRead,
    participating: onlyParticipating,
    headers,
    request: {
      fetch: (url: string, options: any) => {
        return fetch(url, {
          ...options,
          cache: "no-cache",
        });
      },
    },
  });
}
