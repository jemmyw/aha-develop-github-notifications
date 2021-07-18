import React from "react";
import { NotificationSubject } from "../Notification";

export const UnknownSubject: NotificationSubject = ({ notification }) => {
  return <div>{notification.subject.type}?</div>;
};
