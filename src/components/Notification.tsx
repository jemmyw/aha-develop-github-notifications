import React, { useState } from "react";
import { useRecoilCallback } from "recoil";
import { timeAgo } from "../lib/timeAgo";
import { useIncrementPollId } from "../lib/useIncrementPollId";
import { GithubComment, NotificationEnhancements } from "../store/enhance";
import { markNotificationRead } from "../store/helpers/markNotification";
import { authTokenState, GithubNotification } from "../store/notifications";
import { Avatar } from "./Avatar";
import { Comment } from "./Comment";
import { PullRequest, UnknownSubject } from "./subjects";

export type NotificationSubject = React.FC<{
  notification: GithubNotification;
  enhancements: NotificationEnhancements | null;
}>;
export type NotificationReason = React.FC<{
  notification: GithubNotification;
  enhancements: NotificationEnhancements | null;
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

export const Notification: NotificationSubject = ({
  notification,
  enhancements,
}) => {
  const incrementPollId = useIncrementPollId();
  const [markedRead, setMarkedRead] = useState(false);

  const onMark = useRecoilCallback(({ snapshot, set }) => async () => {
    const authToken = await snapshot.getPromise(authTokenState);
    if (!authToken) return;

    setMarkedRead(true);

    try {
      await markNotificationRead(authToken, notification);
    } catch (err) {
      setMarkedRead(false);
    }

    incrementPollId(true);
  });

  const SubjectComponent = getSubjectComponent(notification.subject.type);
  const classNames = ["notification"];

  const isRead = notification.unread ? markedRead : false;
  classNames.push(isRead ? "read" : "unread");

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
            <SubjectComponent
              notification={notification}
              enhancements={enhancements}
            />
          </aha-flex>
          {enhancements?.comment?.body && (
            <Comment comment={enhancements.comment as RequiredComment} />
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
