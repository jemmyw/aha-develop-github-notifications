import React from "react";
import { webLink } from "../../lib/webLink";
import { NotificationSubject } from "../Notification";

export const UnknownSubject: NotificationSubject = ({ enhanced, onVisit }) => {
  const { notification } = enhanced;
  const { subject } = notification;
  return (
    <aha-flex direction="column" gap="5px">
      <div>
        <div className="title">
          <a href={webLink(subject.url)} target="_blank" onClick={onVisit}>
            {subject.title}
          </a>
        </div>
      </div>
    </aha-flex>
  );
};
