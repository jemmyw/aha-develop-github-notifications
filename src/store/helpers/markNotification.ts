import { Octokit } from "@octokit/rest";
import { GithubNotification } from "../notifications";

function chunk<T>(array: T[], size: number): Array<T[]> {
  size = Math.max(Number(size), 0);
  var length = array == null ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }
  let index = 0;
  let resIndex = 0;
  const result: Array<T[]> = Array(Math.ceil(length / size));

  while (index < length) {
    result[resIndex++] = array.slice(index, (index += size));
  }
  return result;
}

export async function markNotificationRead(
  authToken: string,
  notification: GithubNotification
) {
  const api = new Octokit({ auth: authToken });
  await api.rest.activity.markThreadAsRead({
    thread_id: Number(notification.id),
  });
}

export async function markListRead(
  authToken: string,
  notifications: GithubNotification[]
) {
  const batches = chunk(notifications, 3);

  for (let batch of batches) {
    await Promise.all(batch.map((n) => markNotificationRead(authToken, n)));
  }
}

export async function markAllRead(authToken: string) {
  const api = new Octokit({ auth: authToken });
  await api.rest.activity.markNotificationsAsRead({
    read: true,
    last_read_at: new Date().toISOString(),
  });
}
