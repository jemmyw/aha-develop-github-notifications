import { Octokit } from "@octokit/rest";
import { GithubNotification } from "../notifications";

export async function markNotificationRead(
  authToken: string,
  notification: GithubNotification
) {
  const api = new Octokit({ auth: authToken });
  await api.rest.activity.markThreadAsRead({
    thread_id: Number(notification.id),
  });
}

export async function markAllRead(authToken: string) {
  const api = new Octokit({ auth: authToken });
  await api.rest.activity.markNotificationsAsRead({
    read: true,
    last_read_at: new Date().toISOString(),
  });
}
