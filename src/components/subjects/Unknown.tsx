import React from "react";
import { NotificationSubject } from "./NotificationSubject";

export const Unknown: NotificationSubject = ({ notification }) => {
  return <div>{notification.subject.type}?</div>;
};
