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

  if (lastModified) {
    headers["If-Modified-Since"] = lastModified;
  }

  return await api.rest.activity.listNotificationsForAuthenticatedUser({
    all: showRead,
    participating: onlyParticipating,
    headers,
  });
}
