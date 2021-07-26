import React from "react";
import { useRecoilCachedLoadable } from "../lib/useRecoilCachedLoadable";
import { enhancedNotifications } from "../store/enhance";
import { GithubNotification } from "../store/notifications";
import { Notification } from "./subjects";

export const NotificationList: React.FC<{
  notifications: GithubNotification[];
}> = ({ notifications }) => {
  const [enhancements] = useRecoilCachedLoadable(enhancedNotifications, {});

  const items =
    notifications.length > 0 ? (
      notifications.map((notification, idx) => (
        <Notification
          notification={notification}
          enhancements={enhancements[notification.id]}
          key={notification.id}
        />
      ))
    ) : (
      <div className="no-notifications">
        <p>No notifications</p>
      </div>
    );

  return (
    <div
      className={
        "notification-list " + (notifications.length === 0 ? "empty" : "")
      }
    >
      {items}
    </div>
  );
};
