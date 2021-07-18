import React from "react";
import { timeAgo } from "../lib/timeAgo";
import { NotificationEnhancements } from "../store/enhance";
import { GithubNotification } from "../store/notifications";
import { UnknownReason, Comment } from "./reasons";
import { PullRequest, UnknownSubject } from "./subjects";

export type NotificationSubject = React.FC<{
  notification: GithubNotification;
  enhancements: NotificationEnhancements | null;
}>;
export type NotificationReason = React.FC<{
  notification: GithubNotification;
  enhancements: NotificationEnhancements | null;
}>;

function getSubjectComponent(type: string) {
  switch (type) {
    case "PullRequest":
      return PullRequest;
  }

  return UnknownSubject;
}

function getReasonComponent(type: string) {
  switch (type) {
    case "comment":
      return Comment;
  }

  return UnknownReason;
}

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

export const Notification: NotificationSubject = ({
  notification,
  enhancements,
}) => {
  const onMarkRead = () => {};

  const SubjectComponent = getSubjectComponent(notification.subject.type);
  const ReasonComponent = getReasonComponent(notification.reason);

  const classNames = ["notification"];
  if (notification.unread) {
    classNames.push("unread");
  } else {
    classNames.push("read");
  }

  return (
    <div className={classNames.join(" ")}>
      <aha-flex justify-content="space-between">
        <aha-flex direction="column">
          <SubjectComponent
            notification={notification}
            enhancements={enhancements}
          />
          <ReasonComponent
            notification={notification}
            enhancements={enhancements}
          />
        </aha-flex>
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
