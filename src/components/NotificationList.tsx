import React from "react";
import { GithubNotification } from "../store/notifications";
import { NotificationSubject } from "./subjects";

export const NotificationList: React.FC<{
  notifications: GithubNotification[];
}> = ({ notifications }) => {
  const items = notifications.map((notification, idx) => (
    <NotificationSubject notification={notification} key={idx} />
  ));

  return <div className="notification-list">{items}</div>;
};
