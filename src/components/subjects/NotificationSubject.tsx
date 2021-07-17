import React from "react";
import { timeAgo } from "../../lib/timeAgo";
import { GithubNotification } from "../../store/notifications";
import { PullRequest } from "./PullRequest";
import { Unknown } from "./Unknown";

export type NotificationSubject = React.FC<{
  notification: GithubNotification;
}>;

const subjects = {
  PullRequest: PullRequest,
};

function typeIcon(notification: GithubNotification) {
  switch (notification.reason) {
    case "review_requested":
      return "tasks";
    case "author":
      return "user";
    case "mention":
      return "at";
  }

  return notification.reason;
}

export const NotificationSubject: NotificationSubject = ({ notification }) => {
  const onMarkRead = () => {};

  const Component = subjects[notification.subject.type] || Unknown;

  const classNames = ["notification"];
  if (notification.unread) {
    classNames.push("unread");
  } else {
    classNames.push("read");
  }

  return (
    <div className={classNames.join(" ")}>
      <aha-flex justify-content="space-between">
        <Component notification={notification} />
        <div className="right-info">
          <div className="time-ago">{timeAgo(notification.updated_at)}</div>

          <div className="mark" onClick={onMarkRead}>
            <aha-icon icon="fa fa-circle" />
          </div>

          <div className="type">
            <aha-icon icon={`fa fa-${typeIcon(notification)}`} />
          </div>
        </div>
      </aha-flex>
    </div>
  );
};
