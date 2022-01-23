import React from "react";
import { webLink } from "../../lib/webLink";
import { NotificationSubject } from "../Notification";

export const UnknownSubject: NotificationSubject = ({ enhanced }) => {
  const { notification } = enhanced;
  const { subject } = notification;
  return (
    <aha-flex direction="column" gap="5px">
      <div>
        <div className="title">
          <a href={webLink(subject.url)} target="_blank">
            {subject.title}
          </a>
        </div>
      </div>
    </aha-flex>
  );
};
