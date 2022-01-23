import React from "react";
import { useRecoilCachedLoadable } from "../lib/useRecoilCachedLoadable";
import { filteredNotificationsSelector } from "../store/filters";
import { Notification } from "./subjects";

export const NotificationList: React.FC<{}> = () => {
  const [notifications] = useRecoilCachedLoadable(
    filteredNotificationsSelector,
    []
  );

  const items =
    notifications.length > 0 ? (
      notifications.map((notification, idx) => (
        <Notification
          enhanced={notification}
          key={notification.notification.id}
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
