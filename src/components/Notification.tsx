import React from "react";
import { useRecoilValue } from "recoil";
import { timeAgo } from "../lib/timeAgo";
import { EnhancedNotification, GithubComment } from "../store/enhance";
import { GithubNotification } from "../store/notifications";
import { notificationMarkedReadSelector, useMarkListRead } from "../store/read";
import { Avatar } from "./Avatar";
import { Comment } from "./Comment";
import { PullRequest, UnknownSubject } from "./subjects";

export type NotificationSubject = React.FC<{
  enhanced: EnhancedNotification;
}>;
export type NotificationReason = React.FC<{
  notification: EnhancedNotification;
}>;
export type RequiredComment = GithubComment &
  Required<Pick<GithubComment, "body">>;

function getSubjectComponent(type: string) {
  switch (type) {
    case "PullRequest":
      return PullRequest;
  }

  return UnknownSubject;
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

export const Notification: NotificationSubject = ({ enhanced }) => {
  const { notification } = enhanced;
  const markedRead = useRecoilValue(
    notificationMarkedReadSelector(notification.id)
  );
  console.log(notification.id, markedRead);
  const setMarkedRead = useMarkListRead();

  const onMark = () => {
    setMarkedRead([enhanced.notification]);
  };

  const SubjectComponent = getSubjectComponent(notification.subject.type);
  const classNames = ["notification"];

  if (markedRead) {
    classNames.push("read fade");
  } else if (notification.unread) {
    classNames.push("unread");
  } else {
    classNames.push("read");
  }

  return (
    <div className={classNames.join(" ")}>
      <aha-flex justify-content="space-between">
        <aha-flex direction="column" gap="10px">
          <aha-flex gap="8px">
            {notification.repository.owner && (
              <Avatar
                src={notification.repository.owner?.avatar_url}
                size={28}
              />
            )}
            <SubjectComponent enhanced={enhanced} />
          </aha-flex>
          {enhanced?.comment?.body && (
            <Comment comment={enhanced.comment as RequiredComment} />
          )}
        </aha-flex>
        <div className="right-info">
          <aha-flex direction="column" align-items="flex-end" gap="10px">
            <aha-flex align-items="center" gap="5px">
              <div className="time-ago">{timeAgo(notification.updated_at)}</div>

              <div className="type">
                <aha-icon icon={`fa fa-${typeIcon(notification)}`} />
              </div>
            </aha-flex>

            <div className="mark" onClick={onMark}>
              <aha-icon icon="fa fa-circle" />
            </div>
          </aha-flex>
        </div>
      </aha-flex>
    </div>
  );
};
