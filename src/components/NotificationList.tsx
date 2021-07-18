import React from "react";
import { useRecoilValueLoadable } from "recoil";
import { enhancedNotifications } from "../store/enhance";
import { GithubNotification } from "../store/notifications";
import { Notification } from "./subjects";

export const NotificationList: React.FC<{
  notifications: GithubNotification[];
}> = ({ notifications }) => {
  const enhancements = useRecoilValueLoadable(enhancedNotifications);

  const items = notifications.map((notification, idx) => (
    <Notification
      notification={notification}
      enhancements={
        enhancements.state === "hasValue"
          ? enhancements.getValue()[notification.id]
          : null
      }
      key={idx}
    />
  ));

  return <div className="notification-list">{items}</div>;
};
