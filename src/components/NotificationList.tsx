import React from "react";
import { useRecoilCachedLoadble } from "../lib/useRecoilCachedLoadable";
import { enhancedNotifications } from "../store/enhance";
import { GithubNotification } from "../store/notifications";
import { Notification } from "./subjects";

export const NotificationList: React.FC<{
  notifications: GithubNotification[];
}> = ({ notifications }) => {
  const [enhancements] = useRecoilCachedLoadble(enhancedNotifications, {});

  const items = notifications.map((notification, idx) => (
    <Notification
      notification={notification}
      enhancements={enhancements[notification.id]}
      key={notification.id}
    />
  ));

  return <div className="notification-list">{items}</div>;
};
